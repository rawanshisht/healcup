import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productVariants } from '@/lib/schema'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [variant] = await db.insert(productVariants).values({
    productId: body.productId,
    label: body.label,
    price: body.price,
    stock: body.stock ?? 0,
    sortOrder: body.sortOrder ?? 0,
  }).returning()
  return NextResponse.json(variant)
}
