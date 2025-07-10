// // lib/createFlashcardGroups.ts

// import { shuffle } from "lodash";
// import { prisma } from "./prisma";


// export async function createFlashcardGroups(userId: string, chunkSize = 20) {
//   const words = await prisma.word.findMany({ where: { userId } });
//   const shuffled = shuffle(words);

//   const chunks: typeof words[][] = [];
//   for (let i = 0; i < shuffled.length; i += chunkSize) {
//     chunks.push(shuffled.slice(i, i + chunkSize));
//   }

//   // Optional: delete old groups
//   await prisma.flashcardGroup.deleteMany();

//   for (let i = 0; i < chunks.length; i++) {
//     const group = await prisma.flashcardGroup.create({
//       data: {
//         // userId,
//         label: `Flashcard Group ${i + 1}`,
//         order: i,
//         words: {
//           create: chunks[i].map((word, index) => ({
//             wordId: word.id,
//             order: index,
//           })),
//         },
//       },
//     });
//   }
// }


// import { prisma } from "@/lib/prisma";
// import { chunkArray } from "@/lib/utils";
// import { v4 as uuid } from "uuid";

// export async function createFlashcardGroups(userId: string, chunkSize = 20) {
//   const words = await prisma.word.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   const chunks = chunkArray(words, chunkSize);

//   // ✅ First fetch all old group IDs
//   const oldGroups = await prisma.flashcardGroup.findMany({
//     select: { id: true },
//   });
//   const oldGroupIds = oldGroups.map((g) => g.id);

//   // ✅ Delete all group words first
//   await prisma.flashcardGroupWord.deleteMany({
//     where: {
//       groupId: { in: oldGroupIds },
//     },
//   });

//   // ✅ Then delete groups
//   await prisma.flashcardGroup.deleteMany({
//     where: { id: { in: oldGroupIds } },
//   });

//   // ✅ Insert new groups
//   for (let i = 0; i < chunks.length; i++) {
//     await prisma.flashcardGroup.create({
//       data: {
//         // userId,
//         label: `Group ${i + 1}`,
//         order: i,
//         words: {
//           create: chunks[i].map((word, index) => ({
//             wordId: word.id,
//             order: index,
//           })),
//         },
//       },
//     });
//   }
// }



import { prisma } from "@/lib/prisma";
import { chunkArray } from "./utils";
import { shuffle } from "lodash";

export async function createFlashcardGroups(userId: string, chunkSize = 20) {
  // Fetch all words (assuming single-user context)
  const words = shuffle(
    await prisma.word.findMany({
      orderBy: { createdAt: "desc" }, // you can keep or remove this
    })
  );


  console.log("Fetched words:", words.length);


  const chunks = chunkArray(words, chunkSize);
  console.log("Chunks created:", chunks.length);


  // Fetch existing group IDs
  const oldGroups = await prisma.flashcardGroup.findMany({
    select: { id: true },
  });
  const oldGroupIds = oldGroups.map((g) => g.id);

  // Delete group words first
  if (oldGroupIds.length > 0) {
    await prisma.flashcardGroupWord.deleteMany({
      where: {
        groupId: { in: oldGroupIds },
      },
    });

    // Then delete groups
    await prisma.flashcardGroup.deleteMany({
      where: { id: { in: oldGroupIds } },
    });
  }

  // Create new groups
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].length === 0) continue; // 🛡️ skip empty groups just in case

    console.log(`Chunk ${i + 1} has ${chunks[i].length} words`);
    try {
      await prisma.flashcardGroup.create({
        data: {
          userId, // only if your schema expects it and it's not optional
          label: `Group ${i + 1}`,
          order: i,
          words: {
            create: chunks[i].map((word, index) => ({
              wordId: word.id,
              order: index,
            })),
          },
        },
      });

      console.log(`Created Group ${i + 1}`);
    } catch (err) {
      console.error(`❌ Error creating group ${i + 1}:`, err);
    }

  }
}
