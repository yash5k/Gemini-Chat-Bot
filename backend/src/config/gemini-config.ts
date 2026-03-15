import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

export const configureGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI;
};
