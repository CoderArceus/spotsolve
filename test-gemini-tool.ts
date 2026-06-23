import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = "You are a test agent.";
const CRITICAL_ALERT_TOOL = {
  functionDeclarations: [
    {
      name: "triggerCriticalEmergencyAlert",
      description: "Call this tool if needed.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          hazardType: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["hazardType", "reason"],
      },
    },
  ],
};

async function run() {
  try {
    const model = ai.models;
    const res = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "Hello!" }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [CRITICAL_ALERT_TOOL],
      },
    });
    console.log("SUCCESS:", res.text);
  } catch (e: any) {
    console.error("ERROR in first pass:", e.message);
  }
}

run();
