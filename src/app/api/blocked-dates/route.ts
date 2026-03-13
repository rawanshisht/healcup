import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blockedDates } from '@/lib/schema'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { date, reason } = await req.json()
  try {
    const [d] = await db.insert(blockedDates).values({ date, reason }).returning()
    return NextResponse.json(d)
  } catch {
    return NextResponse.json({ error: 'Date may already be blocked' }, { status: 400 })
  }
}
