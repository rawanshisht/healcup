'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { BlockedDate } from '@/lib/schema'
import { Trash2, Plus } from 'lucide-react'

export default function BlockedDatesManager({ initialDates }: { initialDates: BlockedDate[] }) {
  const [dates,  setDates]  = useState(initialDates)
  const [date,   setDate]   = useState('')
  const [reason, setReason] = useState('')

  const add = async () => {
    if (!date) return
    const res = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, reason }),
    })
    if (!res.ok) { toast.error('Failed — date may already be blocked'); return }
    const d = await res.json()
    setDates(prev => [...prev, d])
    setDate('')
    setReason('')
    toast.success('Date blocked')
  }

  const remove = async (id: number) => {
    const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' })
    if (res.ok) setDates(prev => prev.filter(d => d.id !== id))
    else toast.error('Failed to remove')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#e0d9cf] p-4 space-y-3">
        <p className="text-sm font-semibold text-[#1a4a4a]">Add Blocked Date</p>
        <div className="flex gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)" className="flex-1 border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
          <button onClick={add} className="bg-[#1a4a4a] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1e5c5c] flex items-center gap-1.5">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {dates.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No blocked dates.</p>
      ) : (
        <div className="space-y-2">
          {dates.map(d => (
            <div key={d.id} className="flex items-center justify-between bg-white rounded-xl border border-[#e0d9cf] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1a4a4a]">{d.date}</p>
                {d.reason && <p className="text-xs text-gray-400">{d.reason}</p>}
              </div>
              <button onClick={() => remove(d.id)} className="text-red-400 hover:text-red-600 transition-colors p-1.5">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
