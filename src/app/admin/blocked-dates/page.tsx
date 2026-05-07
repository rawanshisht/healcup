export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { blockedDates } from '@/lib/schema'
import { asc } from 'drizzle-orm'
import BlockedDatesManager from './BlockedDatesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Blocked Dates' }

export default async function BlockedDatesPage() {
  const dates = await db.select().from(blockedDates).orderBy(asc(blockedDates.date))
  return (
    <div className="space-y-6 max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Blocked Dates</h1>
        <p className="text-sm text-gray-500 mt-1">Block off holidays, days off, or fully booked dates.</p>
      </div>
      <BlockedDatesManager initialDates={dates} />
    </div>
  )
}
