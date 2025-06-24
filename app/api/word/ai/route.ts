import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { word } = await req.json();

  if (!word) {
    return NextResponse.json({ error: "No word provided" }, { status: 400 });
  }

  try {
    const prompt = `
You are a helpful English vocabulary assistant.
For the word "${word}", provide:

- 2 synonyms
- 2 antonyms
- 1 short example sentence using the word

Format your response in JSON like:
{
  "synonyms": ["..."],
  "antonyms": ["..."],
  "example": "..."
}
`;

    const chat = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const raw = chat.choices[0].message.content || "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI Error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
