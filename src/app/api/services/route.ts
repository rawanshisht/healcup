import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [s] = await db.insert(services).values(body).returning()
  return NextResponse.json(s)
}
