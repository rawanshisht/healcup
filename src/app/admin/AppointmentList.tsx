'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Appointment } from '@/lib/schema'
import { Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#fdf6e3] text-[#b8892a] border-[#c9a84c]/40',
  confirmed: 'bg-[#e6f4f4] text-[#1e5c5c] border-[#2a8a8a]/40',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
}

const SCREENING_LABELS: Record<string, string> = {
  blood_thinners: 'Blood thinners / anticoagulants',
  skin_infection: 'Active skin infection or open wound',
  fever: 'Fever or acute illness',
  pregnant: 'Pregnancy',
  anaemia: 'Severe anaemia / blood disorder',
  recent_surgery: 'Surgery within the last 4 weeks',
}

export default function AppointmentList({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appts, setAppts] = useState(initialAppointments)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [notes, setNotes] = useState<Record<number, string>>({})

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes[id] ?? appts.find(a => a.id === id)?.adminNotes ?? '' }),
    })
    if (res.ok) {
      setAppts(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Appointment ${status}`)
    } else {
      toast.error('Failed to update')
    }
  }

  const saveNotes = async (id: number) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: appts.find(a => a.id === id)?.status, adminNotes: notes[id] ?? '' }),
    })
    if (res.ok) toast.success('Notes saved')
    else toast.error('Failed to save notes')
  }

  if (appts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e0d9cf] p-12 text-center">
        <p className="text-2xl mb-2">📋</p>
        <p className="text-gray-500 text-sm font-medium">No appointments yet</p>
        <p className="text-gray-400 text-xs mt-1">Appointments will appear here once patients book online.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appts.map(a => (
        <div key={a.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#f8f8f8]"
            onClick={() => setExpanded(expanded === a.id ? null : a.id)}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[a.status] ?? a.status}
              </span>
              <div>
                <p className="font-semibold text-[#1a4a4a] text-sm">{a.patientName}</p>
                <p className="text-xs text-gray-500">{a.serviceName} · {a.preferredDate} at {a.preferredTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden sm:block">
                #{a.id} · {format(new Date(a.createdAt), 'dd MMM')}
              </span>
              {expanded === a.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>

          {expanded === a.id && (
            <div className="border-t border-[#e0d9cf] p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1.5">
                  <p><span className="text-gray-400 text-xs">Gender:</span> <span className="capitalize">{a.gender}</span></p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-[#237070]" />
                    <a href={`tel:${a.phone}`} className="text-[#1e5c5c] hover:underline">{a.phone}</a>
                  </p>
                  {a.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail size={12} className="text-[#237070]" />
                      <a href={`mailto:${a.email}`} className="text-[#1e5c5c] hover:underline">{a.email}</a>
                    </p>
                  )}
                  {a.howHeard && <p><span className="text-gray-400 text-xs">Source:</span> {a.howHeard}</p>}
                </div>
                <div>
                  {a.reason && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Reason for visit:</p>
                      <p className="text-sm text-gray-700 bg-[#f4f1eb] rounded-lg px-3 py-2">{a.reason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Screening answers */}
              {(() => {
                const screening = a.screeningAnswers as Record<string, boolean> | null
                const flags = screening ? Object.entries(screening).filter(([, v]) => v) : []
                return flags.length > 0 ? (
                  <div className="bg-[#fff9ed] border border-[#c9a84c]/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#b8892a] mb-2">⚠ Health Screening Flags</p>
                    <ul className="space-y-1">
                      {flags.map(([k]) => (
                        <li key={k} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <span className="text-[#b8892a] shrink-0 mt-0.5">•</span>
                          {SCREENING_LABELS[k] ?? k.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              })()}

              {/* Admin notes */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Admin notes</label>
                <textarea
                  value={notes[a.id] ?? a.adminNotes ?? ''}
                  onChange={e => setNotes(prev => ({ ...prev, [a.id]: e.target.value }))}
                  rows={2}
                  className="w-full text-sm border border-[#e0d9cf] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#237070] resize-none"
                  placeholder="Add internal notes..."
                />
                <button onClick={() => saveNotes(a.id)} className="mt-1 text-xs text-[#237070] hover:underline">Save notes</button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {a.status !== 'confirmed' && (
                  <button onClick={() => updateStatus(a.id, 'confirmed')} className="text-xs bg-[#237070] hover:bg-[#1e5c5c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    ✓ Accept
                  </button>
                )}
                <a
                  href={`https://wa.me/${a.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${a.patientName}, regarding your hijama appointment on ${a.preferredDate} at ${a.preferredTime} — we'd like to confirm or reschedule your booking. Please let us know your availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  Contact Patient
                </a>
                {a.status !== 'cancelled' && (
                  <button onClick={() => updateStatus(a.id, 'cancelled')} className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Cancel
                  </button>
                )}
                {a.status !== 'rescheduled' && (
                  <button onClick={() => updateStatus(a.id, 'rescheduled')} className="text-xs bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Mark Rescheduled
                  </button>
                )}
                {a.status !== 'pending' && (
                  <button onClick={() => updateStatus(a.id, 'pending')} className="text-xs bg-[#b8892a] hover:bg-[#9a7220] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Set Pending
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
