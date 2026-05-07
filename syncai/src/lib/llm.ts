import { GoogleGenerativeAI } from "@google/generative-ai";

export function getModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in .env.local");

  const genai = new GoogleGenerativeAI(key);
  return genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { temperature: 0 },
  });
}
