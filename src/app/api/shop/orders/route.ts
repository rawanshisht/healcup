import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { shopOrders } from '@/lib/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const orders = await db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt))
  return NextResponse.json(orders)
}
