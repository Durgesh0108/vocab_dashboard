// app/api/group/create/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const { label, meaning } = await req.json()

    const group = await prisma.wordGroup.create({
      data: {
        label,
        meaning,
        userId: decoded.id,
      },
    })

    return NextResponse.json({ group })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}
