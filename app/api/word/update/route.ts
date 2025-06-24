import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, update } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await prisma.word.update({
      where: { id },
      data: {
        text: update.text,
        meaning: update.meaning,
        prefix: update.prefix,
        suffix: update.suffix,
        root: update.root,
        synonyms: update.synonyms,
        antonyms: update.antonyms,
        example: update.example,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 400 });
  }
}
