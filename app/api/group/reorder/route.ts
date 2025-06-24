import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const { type, orderList } = await req.json() // type: 'group' | 'word'

    if (type === 'group') {
      await Promise.all(
        orderList.map((id: string, index: number) =>
          prisma.wordGroup.update({ where: { id }, data: { order: index } })
        )
      )
    }

    if (type === 'word') {
      await Promise.all(
        orderList.map((entry: { wordGroupWordId: string; order: number }) =>
          prisma.wordGroupWord.update({
            where: { id: entry.wordGroupWordId },
            data: { order: entry.order },
          })
        )
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
