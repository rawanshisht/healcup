import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET(_: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const rows = await db.select().from(siteContent).where(eq(siteContent.key, key))
  if (!rows.length) return NextResponse.json(null)
  return NextResponse.json(rows[0].value)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { key } = await params
  const value = await req.json()
  await db.insert(siteContent)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteContent.key, set: { value, updatedAt: new Date() } })
  if (key === 'about') revalidatePath('/about')
  if (key === 'how_it_works') revalidatePath('/how-it-works')
  if (key === 'contact_info') {
    revalidatePath('/contact')
    revalidatePath('/', 'layout')
  }
  return NextResponse.json({ ok: true })
}
