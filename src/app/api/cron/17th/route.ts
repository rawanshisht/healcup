import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { send16thReminder } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db
    .select({ patientName: appointments.patientName, phone: appointments.phone, email: appointments.email })
    .from(appointments)
    .where(eq(appointments.status, 'confirmed'))

  // Deduplicate by phone number
  const seen = new Set<string>()
  const unique = rows.filter(r => {
    if (seen.has(r.phone)) return false
    seen.add(r.phone)
    return true
  })

  await Promise.all(
    unique.map(r => send16thReminder(r.email, r.patientName).catch(console.error))
  )

  return NextResponse.json({ sent: unique.length })
}
