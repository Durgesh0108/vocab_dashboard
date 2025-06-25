import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Utility: Get the user from JWT token
async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all WordGroupWord records linking words to the group
    await prisma.wordGroupWord.deleteMany({
      where: { groupId },
    });

    // Delete the WordGroup itself
    await prisma.wordGroup.delete({
      where: {
        id: groupId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
