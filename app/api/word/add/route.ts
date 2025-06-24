import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const body = await req.json()
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let userId = ''
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    userId = decoded.id
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const word = await prisma.word.create({
    data: {
      userId,
      text: body.text,
      meaning: body.meaning,
      synonyms: body.synonyms,
      antonyms: body.antonyms,
      example: body.example,
      prefix: body.prefix,
      suffix: body.suffix,
      root: body.root,
    },
  })

  return NextResponse.json({ word })
}
