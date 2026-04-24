export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import AppointmentList from './AppointmentList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Appointments' }

export default async function AdminPage() {
  const allAppointments = await db
    .select()
    .from(appointments)
    .orderBy(desc(appointments.createdAt))

  const counts = {
    pending:   allAppointments.filter(a => a.status === 'pending').length,
    confirmed: allAppointments.filter(a => a.status === 'confirmed').length,
    today:     allAppointments.filter(a => a.preferredDate === new Date().toISOString().split('T')[0]).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all appointment requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending',   value: counts.pending,   color: '#b8892a' },
          { label: 'Confirmed', value: counts.confirmed, color: '#237070' },
          { label: 'Today',     value: counts.today,     color: '#1a4a4a' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#e0d9cf] text-center shadow-sm">
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <AppointmentList initialAppointments={allAppointments} />
    </div>
  )
}
