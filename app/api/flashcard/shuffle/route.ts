// app/api/flashcard/shuffle/route.ts
import { NextResponse } from "next/server";
import { createFlashcardGroups } from "@/lib/createFlashcardGroups";
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let userId = ''
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    userId = decoded.id
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  await createFlashcardGroups(userId);
  return NextResponse.json({ message: "Flashcard groups reshuffled!" });
}


// import { NextResponse } from "next/server";
// import { createFlashcardGroups } from "@/lib/createFlashcardGroups";
// import { auth } from "@/lib/auth"; // Make sure this returns the user from JWT

// export async function POST() {
//   try {
//     const user = await auth(); // Should return: { id: string, email: string }

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await createFlashcardGroups(user.id); // Assumes this resets and reshuffles groups

//     return NextResponse.json({ message: "Flashcard groups reshuffled!" });
//   } catch (error) {
//     console.error("Error in flashcard shuffle:", error);
//     return NextResponse.json(
//       { error: "Something went wrong while reshuffling." },
//       { status: 500 }
//     );
//   }
// }
