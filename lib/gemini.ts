// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function fetchGeminiWordDetails(word: string) {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = `
// You're a vocabulary assistant.

// Give me a JSON object with:
// - synonyms (max 5)
// - antonyms (max 5)
// - a short example sentence

// For the word: "${word}"

// Format:
// {
//   "synonyms": [],
//   "antonyms": [],
//   "example": ""
// }
// `;

//   try {
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     const response = result.response;
//     const text = response.text();

//     // Parse the JSON from the response
//     const jsonStart = text.indexOf("{");
//     const json = text.slice(jsonStart);

//     return JSON.parse(json);
//   } catch (err) {
//     console.error("Gemini error:", err);
//     return { synonyms: [], antonyms: [], example: "" };
//   }
// }

// import { GoogleGenAI } from "@google/genai";

// const genAI = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function fetchGeminiWordDetails(word: string) {
//   const prompt = `
// You're a vocabulary assistant.

// Give me a JSON object with:
// - synonyms (max 5)
// - antonyms (max 5)
// - a short example sentence

// For the word: "${word}"

// Format:
// {
//   "synonyms": [],
//   "antonyms": [],
//   "example": ""
// }
// `;

//   try {
//     const result = await genAI.models.generateContent({
//       model: "models/gemini-1.5-flash", // or models/gemini-1.5-pro
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     // Extract valid JSON using regex
//     const match = content.match(/{[\s\S]+?}/);
//     if (!match) throw new Error("No valid JSON found in AI response");

//     const cleanJSON = match[0];
//     return JSON.parse(cleanJSON);
//   } catch (err) {
//     console.error("Gemini error:", err);
//     return {
//       synonyms: [],
//       antonyms: [],
//       example: "",
//     };
//   }
// }




// lib/fetchGemini.ts (client-side helper)
export async function fetchGeminiWordDetails(word: string) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word }),
  });

  if (!res.ok) throw new Error("AI fetch failed");
  return res.json();
}
