import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productVariants } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const [variant] = await db.update(productVariants).set({
    label: body.label,
    price: body.price,
    stock: body.stock,
    sortOrder: body.sortOrder ?? 0,
  }).where(eq(productVariants.id, parseInt(id))).returning()
  return NextResponse.json(variant)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.delete(productVariants).where(eq(productVariants.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}
