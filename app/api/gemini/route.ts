
// app/api/gemini/route.ts

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  const { word } = await req.json();

  const prompt = `
You're a vocabulary assistant.

Give me a JSON object with:
- meaning (in simple, easy-to-understand words)
- synonyms (max 5)
- antonyms (max 5)
- a short example sentence
- prefix (if any)
- suffix (if any)
- root word (if any)

For the word: "${word}"

Format:
{
  "meaning": "",
  "synonyms": [],
  "antonyms": [],
  "example": "",
  "prefix": "",
  "suffix": "",
  "root": ""
}
`;

  try {
    const result = await genAI.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = content.match(/{[\s\S]+?}/);
    if (!match) throw new Error("No valid JSON found");

    const json = JSON.parse(match[0]);
    return NextResponse.json(json);
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      {
        error: "AI error",
        meaning: "",
        synonyms: [],
        antonyms: [],
        example: "",
        prefix: "",
        suffix: "",
        root: ""
      },
      { status: 500 }
    );
  }
}
