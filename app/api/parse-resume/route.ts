import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

async function generateWithRetry(prompt: string, retries = 5, delay = 2000): Promise<any> {
  try {
    return await ai.models.generateContent({
      model: "gemini-3.7-flash", // Updated to the current production model
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
  } catch (error: any) {
    if (retries > 0 && (error?.status === 503 || error?.message?.includes("unavailable"))) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateWithRetry(prompt, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    const prompt = `Parse this resume text into a strict JSON object with:
      1. "personalInfo": { name, email, phone, location, linkedin, github } (Use empty string "" for any missing fields).
      2. "sections": An array of sections. Each section must have a unique string "id" (e.g., "sec-1"), "title", "type" (one of: "structured", "projects", "skills", "standard", "credentials", "references", "languages"), and "items" array.
      - Each item in "items" MUST have a unique string "id" (e.g., "item-1").
      - For "structured" items (Experience, Education, Affiliations), populate: title, subtitle, location, startDate, endDate, description.
      - For "projects" items, populate: title, startDate, endDate, description.
      - For "skills" items, populate: groupName, skills.
      Ensure all fields are explicitly provided as strings, using "" if empty. Text:\n${rawText}`;

    const response = await generateWithRetry(prompt);

    if (!response.text) {
      return NextResponse.json({ error: "The AI returned an empty response" }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (err: any) {
    console.error("Gemini Parse Error:", err);
    return NextResponse.json({ error: err?.message || "Failed to parse resume due to high traffic." }, { status: 500 });
  }
}