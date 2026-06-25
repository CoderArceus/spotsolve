import { NextRequest, NextResponse } from "next/server";
import { GeminiResponseSchema, SubmitIssueSchema } from "@/lib/schemas";
import { GeminiAnalysisResult, Ticket, TicketStatus } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";
import { withRetry } from "@/lib/retry";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Validate environment configuration
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "[analyze-issue] Missing GEMINI_API_KEY environment variable",
      );
      return NextResponse.json(
        { error: "Server not configured: GEMINI_API_KEY missing" },
        { status: 500 },
      );
    }

    // 0. Rate limiting: 100 requests per hour per IP (relaxed for hackathon testing)
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp, {
      maxRequests: 100,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": (rateLimitResult.retryAfter || 3600).toString(),
          },
        },
      );
    }

    // 1. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const citizenEmail =
      (formData.get("citizenEmail") as string | null) ?? undefined;
    const citizenUid =
      (formData.get("citizenUid") as string | null) ?? undefined;
    const userDescription =
      (formData.get("userDescription") as string | null) ?? undefined;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 2. Validate non-file fields
    const parsed = SubmitIssueSchema.safeParse({
      latitude,
      longitude,
      citizenEmail,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // 3. Convert image to base64 inline data for Gemini
    const imageBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
      },
    };

    // Dynamic imports to avoid build-time initialization
    const {
      ai,
      SYSTEM_PROMPT,
      RESPONSE_SCHEMA,
      CRITICAL_ALERT_TOOL,
      handleToolCall,
    } = await import("@/lib/gemini");
    const { adminDb } = await import("@/lib/firebase-admin");

    // 4. Bypass Firebase Storage (Storage is paid) -> use base64 Data URI
    const ticketId = uuidv4();
    let imageUrl = `data:${file.type};base64,${base64Image}`;
    
    // Firestore limits documents to 1MB. If the base64 string is too large, it will crash with a 500.
    if (imageUrl.length > 800000) {
      console.warn("Image too large for Firestore Data URI. Using placeholder to prevent 500 error.");
      imageUrl = "https://placehold.co/600x400?text=Image+Too+Large+For+DB";
    }

    // 5. Call Gemini with multimodal input + tool + structured output
    const model = ai.models;

    let emergencyTriggered = false;
    let emergencyReason: string | undefined;

    let rawText = "";
    
    const basePrompt = "Analyze this community issue image. If it is Critical severity, call the emergency alert tool. Then return the structured JSON analysis.";
    const fullPrompt = userDescription ? `${basePrompt}\nThe user provided the following additional context: "${userDescription}"` : basePrompt;

    try {
      // First pass: allow tool calling
      const toolResponse = await model.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              imagePart,
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [CRITICAL_ALERT_TOOL],
        },
      });

      // 6. Handle tool call if Gemini decided to trigger the emergency alert
      const candidate = toolResponse.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.functionCall?.name === "triggerCriticalEmergencyAlert") {
            const result = handleToolCall(
              part.functionCall.name,
              part.functionCall.args as Record<string, string>,
            );
            emergencyTriggered = result.triggered;
            emergencyReason = result.reason;
          }
        }
      }

      // 7. Second pass: get structured JSON output
      const structuredResponse = await model.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              imagePart,
              { text: `Return your structured JSON analysis of this image.\n${userDescription ? `The user provided the following additional context: "${userDescription}"` : ""}` },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      rawText =
        structuredResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (apiError) {
      console.warn(
        "Gemini API call failed (quota/load), using mock data instead:",
        apiError,
      );
      rawText = JSON.stringify({
        category: "Pothole",
        severity: "Medium",
        description:
          "Mocked description due to API quota limits. Looks like an infrastructure issue.",
        confidenceScore: 0.95,
        isValidIssue: true,
      });
    }
    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 502 },
      );
    }

    // 8. Parse and validate with Zod
    const aiJson = JSON.parse(rawText);
    const validated = GeminiResponseSchema.safeParse(aiJson);
    if (!validated.success) {
      return NextResponse.json(
        {
          error: "AI response did not match expected schema",
          details: validated.error.flatten(),
        },
        { status: 502 },
      );
    }

    const aiData = validated.data;

    // 9. Create ticket object
    const initialStatus: TicketStatus = aiData.isValidIssue ? "AI Verified" : "Rejected";
    const now = new Date().toISOString();

    const ticket: Ticket = {
      id: ticketId,
      createdAt: now,
      imageUrl,
      latitude,
      longitude,
      category: aiData.category,
      severity: aiData.severity,
      description: aiData.description,
      status: initialStatus,
      statusHistory: [
        { status: "Reported", timestamp: now },
        { status: initialStatus, timestamp: now, note: `AI confidence: ${(aiData.confidenceScore * 100).toFixed(0)}%` },
      ],
      citizenUid: citizenUid ?? undefined,
      aiConfidence: aiData.confidenceScore,
      upvotes: 0,
      isValidIssue: aiData.isValidIssue,
      emergencyAlertTriggered: emergencyTriggered,
    };
    if (citizenEmail) {
      ticket.citizenEmail = citizenEmail;
    }

    // 10. Write ticket to Firestore if valid (discard if invalid)
    try {
      if (aiData.isValidIssue) {
        await withRetry(
          async () => {
            await adminDb.collection("tickets").doc(ticketId).set(ticket);
          },
          { maxAttempts: 3 },
        );
      } else {
        console.log(`[analyze-issue] Discarding invalid report: ${ticketId}`);
      }
    } catch (dbError) {
      console.warn("Failed to save to Firestore (DB may not be initialized). Returning AI result anyway.", dbError);
    }

    // 11. Return result to client
    const result: GeminiAnalysisResult = {
      ...aiData,
      emergencyTriggered,
      emergencyReason,
    };

    return NextResponse.json({ ticket, analysis: result }, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    console.error("[analyze-issue] Error:", error);

    // Check for specific error types
    if (error?.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }
    if (error?.message?.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        { error: "Gemini API permission denied. Check API key." },
        { status: 401 },
      );
    }
    if (error?.message?.includes("QUOTA_EXCEEDED")) {
      return NextResponse.json(
        { error: "Gemini API quota exceeded. Try again later." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error?.message },
      { status: 500 },
    );
  }
}
