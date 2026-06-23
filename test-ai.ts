import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const models = await ai.models.list();
    console.log("AVAILABLE MODELS:");
    for await (const m of models) {
      if (m.name.includes("gemini")) {
        console.log(m.name);
      }
    }
  } catch (e: any) {
    console.error("ERROR listing models:", e.message);
  }
}

run();
