import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { and, eq, ne, sql } from 'drizzle-orm'

const SLOT_CAPACITY = 3

function timeToMinutes(t: string): number {
  const m = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
  if (!m) return 0
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  const period = m[3].toUpperCase()
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + min
}

function minutesToTime(mins: number): string {
  const total = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(total / 60)
  const m = total % 60
  const period = h < 12 ? 'AM' : 'PM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  if (!date || !time) {
    return NextResponse.json({ error: 'date and time are required' }, { status: 400 })
  }

  const active = ne(appointments.status, 'cancelled')

  // Count bookings at the requested time
  const [{ count: countAtT }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(and(eq(appointments.preferredDate, date), eq(appointments.preferredTime, time), active))

  // Count bookings at T-1h (3 people there means they occupy 2h, blocking T)
  const prevTime = minutesToTime(timeToMinutes(time) - 60)
  const [{ count: countAtPrev }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(appointments)
    .where(and(eq(appointments.preferredDate, date), eq(appointments.preferredTime, prevTime), active))

  const overflowBlocked = countAtPrev >= SLOT_CAPACITY
  const directlyFull = countAtT >= SLOT_CAPACITY
  const blocked = overflowBlocked || directlyFull
  const available = blocked ? 0 : SLOT_CAPACITY - countAtT

  return NextResponse.json({ booked: countAtT, available, blocked, capacity: SLOT_CAPACITY })
}
