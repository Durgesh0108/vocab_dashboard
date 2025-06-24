import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Word ID is required" }, { status: 400 });
    }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 🔸 Step 1: Remove all group relations for the word
    await prisma.wordGroupWord.deleteMany({
      where: { wordId: id },
    });

    // 🔸 Step 2: Now delete the word
    await prisma.word.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete word" }, { status: 400 });
  }
}
