import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { createdAt, id: _id, ...data } = body
  const [s] = await db.update(services).set(data).where(eq(services.id, parseInt(id))).returning()
  revalidatePath('/')
  revalidatePath('/services')
  return NextResponse.json(s)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.delete(services).where(eq(services.id, parseInt(id)))
  revalidatePath('/')
  revalidatePath('/services')
  return NextResponse.json({ ok: true })
}
