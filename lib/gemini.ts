import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function fetchGeminiWordDetails(word: string) {
  console.log("triggered")
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Give me the following details for the word "${word}":
1. Synonyms (5 max)
2. Antonyms (5 max)
3. A short example sentence
Return the output in JSON format like this:
{
  "synonyms": [],
  "antonyms": [],
  "example": ""
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON
    const jsonStart = text.indexOf("{");
    const json = text.slice(jsonStart);

    return JSON.parse(json);
  } catch (err) {
    console.error("Gemini error:", err);
    return { synonyms: [], antonyms: [], example: "" };
  }
}
