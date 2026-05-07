export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { shopOrders, shopOrderItems } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'
import OrdersList from './OrdersList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Orders' }

export default async function AdminOrdersPage() {
  const allOrders = await db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt))
  const allItems  = await db.select().from(shopOrderItems)

  const orders = allOrders.map(o => ({
    ...o,
    items: allItems.filter(i => i.orderId === o.id),
  }))

  return (
    <div className="space-y-6 max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage shop orders.</p>
      </div>
      <OrdersList initialOrders={orders} />
    </div>
  )
}
