import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { sql } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { status, adminNotes } = body

  await db
    .update(appointments)
    .set({ status, adminNotes, updatedAt: sql`NOW()` })
    .where(eq(appointments.id, parseInt(id)))

  return NextResponse.json({ success: true })
}
