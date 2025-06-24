// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const words = await prisma.word.findMany({
      where: {
        userId: decoded.id,
        OR: [
          { text: { contains: q || '', mode: 'insensitive' } },
          { meaning: { contains: q || '', mode: 'insensitive' } },
          { synonyms: { hasSome: [q] } },
          { antonyms: { hasSome: [q] } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ words })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
