import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, ".env") });

async function checkModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", apiKey.substring(0, 5) + "...");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test direct fetch of models list
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Mevcut Modeller:");
      data.models.forEach(m => console.log("- " + m.name));
    } else {
      console.log("Modeller listelenemedi:", JSON.stringify(data));
    }
    
  } catch (error) {
    console.log("HATA:", error.message);
  }
}

checkModels();
