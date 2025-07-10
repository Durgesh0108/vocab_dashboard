// // app/api/flashcard/groups/route.ts

// import { auth } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from 'jsonwebtoken'

// export async function GET() {
//   // const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

//   // if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   // let userId = ''
//   // try {
//   //   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
//   //   userId = decoded.id
//   // } catch {
//   //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//   // }

//   const groups = await prisma.flashcardGroup.findMany({
//     // where: { userId: user.id },
//     orderBy: { order: "asc" },
//     include: {
//       words: {
//         include: {
//           word: true,
//         },
//         orderBy: { order: "asc" },
//       },
//     },
//   });

//   const transformed = groups.map((group) =>
//     group.words.map((entry) => ({
//       id: entry.word.id,
//       text: entry.word.text,
//       meaning: entry.word.meaning,
//       example: entry.word.example || "",
//       synonyms: entry.word.synonyms,
//       antonyms: entry.word.antonyms,
//     }))
//   );

//   return NextResponse.json(transformed);
// }


// app/api/flashcard/groups/route.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {

  const groups = await prisma.flashcardGroup.findMany({
    where: {

      words: {
        some: {}, // Only groups with at least one word
      },
    },
    orderBy: { order: "asc" },
    include: {
      words: {
        include: {
          word: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  const formatted = groups.map((group) =>
    group.words.map((w) => ({
      id: w.word.id,
      text: w.word.text,
      meaning: w.word.meaning,
      example: w.word.example,
      synonyms: w.word.synonyms,
      antonyms: w.word.antonyms,
    }))
  );

  return NextResponse.json(formatted);
}
