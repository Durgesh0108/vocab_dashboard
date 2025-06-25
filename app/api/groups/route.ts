// app/api/groups/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const groups = await prisma.wordGroup.findMany({
      where: { userId: decoded.id },
      include: {
        words: {
          include: {
            word: true,
          },
        },
      },
      orderBy: { label: 'asc' },
    })

    // Flatten result to return group with its words directly
    const formatted = groups.map(group => ({
      ...group,
      words: group.words.map(w => w.word), // now words is Word[]
    }))

    return NextResponse.json({ groups: formatted })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}
