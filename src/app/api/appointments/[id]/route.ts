import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { sendConfirmationNotifications } from '@/lib/notifications'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const apptId = parseInt(id)
  const { status, adminNotes } = await req.json()

  const [existing] = await db.select().from(appointments).where(eq(appointments.id, apptId))

  await db
    .update(appointments)
    .set({ status, adminNotes, updatedAt: sql`NOW()` })
    .where(eq(appointments.id, apptId))

  // Send confirmation notifications only when first flipping to confirmed
  if (status === 'confirmed' && existing?.status !== 'confirmed') {
    const updated = { ...existing, status, adminNotes: adminNotes ?? existing?.adminNotes }
    sendConfirmationNotifications(updated).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
