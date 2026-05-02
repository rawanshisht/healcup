import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { and, eq, sql } from 'drizzle-orm'
import { send24hReminder } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const appts = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.status, 'confirmed'),
        sql`${appointments.preferredDate}::date = ${tomorrowStr}::date`,
      )
    )

  await Promise.all(appts.map(a => send24hReminder(a).catch(console.error)))

  return NextResponse.json({ sent: appts.length, date: tomorrowStr })
}
