import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { createdAt, id: _id, ...data } = body
  const [s] = await db.update(services).set(data).where(eq(services.id, parseInt(id))).returning()
  return NextResponse.json(s)
}
