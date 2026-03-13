'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { Service } from '@/lib/schema'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

type ServiceForm = {
  name: string
  description: string
  durationMinutes: number
  price: number
  restrictions: string
  active: boolean
  sortOrder: number
}

const emptyForm: ServiceForm = { name: '', description: '', durationMinutes: 45, price: 40, restrictions: '', active: true, sortOrder: 0 }

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing,  setEditing]  = useState<number | null>(null)
  const [adding,   setAdding]   = useState(false)
  const [form,     setForm]     = useState<ServiceForm>(emptyForm)

  const save = async () => {
    const method = editing ? 'PUT' : 'POST'
    const url    = editing ? `/api/services/${editing}` : '/api/services'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { toast.error('Failed to save'); return }
    const data = await res.json()
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing ? data : s))
      setEditing(null)
    } else {
      setServices(prev => [...prev, data])
      setAdding(false)
    }
    setForm(emptyForm)
    toast.success('Service saved')
  }

  const toggleActive = async (s: Service) => {
    const res = await fetch(`/api/services/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, active: !s.active }),
    })
    if (res.ok) {
      setServices(prev => prev.map(sv => sv.id === s.id ? { ...sv, active: !sv.active } : sv))
    }
  }

  const startEdit = (s: Service) => {
    setEditing(s.id)
    setAdding(false)
    setForm({
      name: s.name,
      description: s.description ?? '',
      durationMinutes: s.durationMinutes,
      price: Number(s.price),
      restrictions: s.restrictions ?? '',
      active: s.active,
      sortOrder: s.sortOrder,
    })
  }

  const ServiceFormFields = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {([['name','Name *','text'],['description','Description','text'],['restrictions','Restrictions','text']] as [keyof ServiceForm, string, string][]).map(([k, label]) => (
        <div key={k} className={k === 'description' ? 'sm:col-span-2' : ''}>
          <label className="text-xs text-gray-500 block mb-1">{label}</label>
          <input
            value={String(form[k])}
            onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
            className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
          />
        </div>
      ))}
      <div>
        <label className="text-xs text-gray-500 block mb-1">Duration (min)</label>
        <input type="number" value={form.durationMinutes} onChange={e => setForm(p => ({ ...p, durationMinutes: parseInt(e.target.value) }))} className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
        <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) }))} className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div className="flex gap-3">
        <button onClick={save} className="flex items-center gap-1.5 bg-[#1a4a4a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1e5c5c]"><Check size={13} /> Save</button>
        <button onClick={() => { setEditing(null); setAdding(false); setForm(emptyForm) }} className="flex items-center gap-1.5 border border-[#e0d9cf] text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"><X size={13} /> Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-3">
      {services.map(s => (
        <div key={s.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm p-4">
          {editing === s.id ? (
            <ServiceFormFields />
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1a4a4a] text-sm">{s.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${s.active ? 'bg-[#e6f4f4] text-[#1e5c5c] border-[#2a8a8a]/30' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {s.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">£{Number(s.price).toFixed(0)} · {s.durationMinutes} min{s.restrictions ? ` · ${s.restrictions}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(s)} className="text-xs text-gray-400 hover:text-[#237070] transition-colors">
                  {s.active ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => startEdit(s)} className="p-1.5 text-gray-400 hover:text-[#1a4a4a] transition-colors">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="bg-white rounded-xl border border-[#237070] p-4">
          <p className="text-sm font-semibold text-[#1a4a4a]">New Service</p>
          <ServiceFormFields />
        </div>
      ) : (
        <button onClick={() => { setAdding(true); setEditing(null); setForm(emptyForm) }} className="flex items-center gap-2 text-sm text-[#237070] hover:text-[#1a4a4a] font-semibold transition-colors">
          <Plus size={16} /> Add Service
        </button>
      )}
    </div>
  )
}
