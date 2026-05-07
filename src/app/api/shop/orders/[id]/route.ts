import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { shopOrders, shopOrderItems } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [order] = await db.select().from(shopOrders).where(eq(shopOrders.id, parseInt(id)))
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const items = await db.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, parseInt(id)))
  return NextResponse.json({ ...order, items })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const [order] = await db.update(shopOrders).set({ status: body.status }).where(eq(shopOrders.id, parseInt(id))).returning()
  return NextResponse.json(order)
}
