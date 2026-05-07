import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, productVariants } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const [product] = await db.update(products).set({
    name: body.name,
    description: body.description ?? null,
    imageUrl: body.imageUrl ?? null,
    price: body.price ? String(body.price) : null,
    stock: parseInt(body.stock) || 0,
    active: body.active,
    sortOrder: body.sortOrder ?? 0,
  }).where(eq(products.id, parseInt(id))).returning()
  return NextResponse.json(product)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.delete(products).where(eq(products.id, parseInt(id)))
  return NextResponse.json({ ok: true })
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product] = await db.select().from(products).where(eq(products.id, parseInt(id)))
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, parseInt(id))).orderBy(asc(productVariants.sortOrder))
  return NextResponse.json({ ...product, variants })
}
