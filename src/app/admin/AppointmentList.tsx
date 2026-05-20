'use client'

import { useState, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Appointment } from '@/lib/schema'
import { Phone, Mail, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const PAGE_SIZE = 10

const STATUS_STYLES: Record<string, string> = {
  awaiting_payment: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-[#fdf6e3] text-[#b8892a] border-[#c9a84c]/40',
  confirmed: 'bg-[#e6f4f4] text-[#1e5c5c] border-[#2a8a8a]/40',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
}

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: 'Awaiting Payment',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
}

const SCREENING_LABELS: Record<string, string> = {
  blood_thinners: 'Blood thinners / anticoagulants',
  high_blood_pressure: 'High blood pressure (hypertension)',
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
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const listRef = useRef<HTMLDivElement>(null)

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of appts) {
      if (a.groupId) counts[a.groupId] = (counts[a.groupId] ?? 0) + 1
    }
    return counts
  }, [appts])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return appts.filter(a => {
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter
      const matchesSearch = !q || [a.patientName, a.phone, a.email ?? '', a.serviceName].some(
        v => v.toLowerCase().includes(q)
      )
      return matchesStatus && matchesSearch
    })
  }, [appts, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setExpanded(null)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyFilter = (newSearch: string, newStatus: string) => {
    setSearch(newSearch)
    setStatusFilter(newStatus)
    setCurrentPage(1)
    setExpanded(null)
  }

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
    <div ref={listRef} className="space-y-3 pb-10">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => applyFilter(e.target.value, statusFilter)}
            placeholder="Search by name, phone, or service…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-[#e0d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237070] bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => applyFilter(search, e.target.value)}
          className="text-sm border border-[#e0d9cf] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#237070] text-gray-700"
        >
          <option value="all">All statuses</option>
          <option value="awaiting_payment">Awaiting Payment</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e0d9cf] p-10 text-center">
          <p className="text-gray-400 text-sm">No appointments match your search.</p>
        </div>
      ) : (
        <>
          {paginated.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#f8f8f8]"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[a.status] ?? a.status}
                  </span>
                  {a.depositPaid ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                      £20 Deposit Paid
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-gray-50 text-gray-400 border-gray-200">
                      No Deposit
                    </span>
                  )}
                  {a.groupId && (groupCounts[a.groupId] ?? 1) > 1 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
                      Group of {groupCounts[a.groupId]}
                    </span>
                  )}
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
                      {a.groupId && (groupCounts[a.groupId] ?? 1) > 1 && (
                        <p>
                          <span className="text-gray-400 text-xs">Group ID:</span>{' '}
                          <span className="font-mono text-xs text-indigo-600">{a.groupId.slice(0, 8)}…</span>
                          <span className="text-gray-400 text-xs ml-1">({groupCounts[a.groupId]} people booked together)</span>
                        </p>
                      )}
                      <p>
                        <span className="text-gray-400 text-xs">Deposit:</span>{' '}
                        {a.depositPaid
                          ? <span className="text-emerald-600 font-semibold text-xs">£20 paid via Stripe ✓</span>
                          : <span className="text-gray-400 text-xs">Not paid</span>
                        }
                      </p>
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

                  {(() => {
                    const screening = a.screeningAnswers as Record<string, unknown> | null
                    if (!screening) return null
                    const flags = Object.entries(screening).filter(([, v]) => v === true)
                    const lastHijama = screening.lastHijama as string | null
                    return (
                      <>
                        {flags.length > 0 && (
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
                        )}
                        {lastHijama && (
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-600">Last hijama session:</span> {lastHijama}
                          </p>
                        )}
                      </>
                    )
                  })()}

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

                  <div className="flex gap-2 flex-wrap">
                    {a.status !== 'confirmed' && (
                      a.depositPaid ? (
                        <button onClick={() => updateStatus(a.id, 'confirmed')} className="text-xs bg-[#237070] hover:bg-[#1e5c5c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                          ✓ Accept
                        </button>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-400 font-semibold px-4 py-2 rounded-lg cursor-not-allowed" title="Cannot accept — deposit not paid">
                          ✓ Accept (deposit required)
                        </span>
                      )
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#e0d9cf] text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[30px] h-[30px] text-xs font-semibold rounded-lg border transition-colors ${page === currentPage
                        ? 'bg-[#1a4a4a] text-white border-[#1a4a4a]'
                        : 'border-[#e0d9cf] text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-[#e0d9cf] text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
