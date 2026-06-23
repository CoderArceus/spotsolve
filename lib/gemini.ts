import { GoogleGenAI, Type } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── System Prompt ────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `
You are an autonomous Municipal Infrastructure Dispatcher Agent for Community Hero.
Your job is to evaluate photos uploaded by citizens reporting public issues.

Rules:
1. Determine if the image genuinely shows a public infrastructure problem (pothole, water leak, broken streetlight, illegal dumping, waste management). If it is spam, unrelated, or unclear, mark isValidIssue as false and category as "Invalid".
2. Assess hazard severity using these definitions:
   - Low: Minor cosmetic issue, no immediate risk
   - Medium: Inconvenient, may worsen over time
   - High: Safety risk, needs attention within 48 hours
   - Critical: Immediate life-safety risk — sinkholes, exposed wiring, severe flooding
3. Write a concise 2-sentence description for the maintenance crew.
4. Assign a confidenceScore between 0.0 (uncertain) and 1.0 (certain).
5. If severity is Critical, you MUST call the triggerCriticalEmergencyAlert tool before responding.

Respond ONLY with the JSON schema provided. No markdown, no explanation.
`;

// ─── Response Schema (correct lowercase types for @google/genai SDK) ──────────
export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isValidIssue: { type: Type.BOOLEAN },
    category: {
      type: Type.STRING,
      enum: ["Pothole", "Water Leak", "Broken Streetlight", "Waste Management", "Invalid"],
    },
    severity: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    description: { type: Type.STRING },
    confidenceScore: { type: Type.NUMBER },
  },
  required: ["isValidIssue", "category", "severity", "description", "confidenceScore"],
};

// ─── Agentic Tool Declaration ─────────────────────────────────────────────────
// This is the function Gemini can autonomously CHOOSE to call.
// The handler below closes the loop — without the handler, there is no agentic depth.
export const CRITICAL_ALERT_TOOL = {
  functionDeclarations: [
    {
      name: "triggerCriticalEmergencyAlert",
      description:
        "Call this tool when the issue poses an immediate life-safety risk (e.g., massive sinkhole, exposed live electrical wires, severe road collapse). Triggers a high-priority alert to city engineering teams.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          hazardType: {
            type: Type.STRING,
            description: "Short label for the hazard type, e.g. 'Exposed Wiring'",
          },
          reason: {
            type: Type.STRING,
            description: "One sentence explaining why this is a life-safety emergency",
          },
        },
        required: ["hazardType", "reason"],
      },
    },
  ],
};

// ─── Tool Call Handler (closes the agentic loop) ──────────────────────────────
export function handleToolCall(toolName: string, args: Record<string, string>) {
  if (toolName === "triggerCriticalEmergencyAlert") {
    // In production: fire a Resend/SendGrid email or Twilio SMS here.
    // For hackathon: log to Firestore as an emergency record + return metadata.
    console.warn(
      `[EMERGENCY ALERT TRIGGERED] Hazard: ${args.hazardType} | Reason: ${args.reason}`
    );
    return {
      triggered: true,
      hazardType: args.hazardType,
      reason: args.reason,
      timestamp: new Date().toISOString(),
    };
  }
  return { triggered: false };
}
