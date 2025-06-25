// app/api/test-gemini/route.ts
import { fetchGeminiWordDetails } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await fetchGeminiWordDetails("obscure");
  return NextResponse.json(result);
}

