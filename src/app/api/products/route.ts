import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, productVariants } from '@/lib/schema'
import { asc, eq } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder))
  const variants = await db.select().from(productVariants).orderBy(asc(productVariants.sortOrder))
  const result = rows.map(p => ({ ...p, variants: variants.filter(v => v.productId === p.id) }))
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [product] = await db.insert(products).values({
    name: body.name,
    description: body.description ?? null,
    imageUrl: body.imageUrl ?? null,
    price: body.price ? String(body.price) : null,
    stock: parseInt(body.stock) || 0,
    active: body.active ?? true,
    sortOrder: body.sortOrder ?? 0,
  }).returning()
  return NextResponse.json(product)
}
