import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
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

async function run() {
  try {
    const model = ai.models;
    const res = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "Hello! Output a pothole JSON." }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
    console.log("SUCCESS:", res.text);
  } catch (e: any) {
    console.error("ERROR in second pass:", e.message);
  }
}

run();
