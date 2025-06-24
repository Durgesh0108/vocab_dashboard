import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export async function fetchSimilarAndOppositeWords(word: string) {
  const res = await fetch("/api/word/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word }),
  });

  if (!res.ok) throw new Error("AI fetch failed");
  return await res.json();
}

