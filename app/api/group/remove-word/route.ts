import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const { wordId, groupId } = await req.json()

    await prisma.wordGroupWord.deleteMany({
      where: {
        wordId,
        groupId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove word from group' }, { status: 500 })
  }
}
