'use client'

import { useState, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import type { Service } from '@/lib/schema'
import { Pencil, Trash2, Plus, Check, X, AlertTriangle, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const PAGE_SIZE = 6

type ServiceForm = {
  name: string
  description: string
  durationMinutes: number
  price: number
  restrictions: string
  active: boolean
  sortOrder: number
}

const emptyForm: ServiceForm = {
  name: '', description: '', durationMinutes: 45, price: 40,
  restrictions: '', active: true, sortOrder: 0,
}

function FormFields({
  form, setForm, onSave, onCancel,
}: {
  form: ServiceForm
  setForm: React.Dispatch<React.SetStateAction<ServiceForm>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      <div>
        <label className="text-xs text-gray-500 block mb-1">Name *</label>
        <input
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
        <input
          type="number"
          value={form.price}
          onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) }))}
          className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-gray-500 block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070] resize-none"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Duration (min)</label>
        <input
          type="number"
          value={form.durationMinutes}
          onChange={e => setForm(p => ({ ...p, durationMinutes: parseInt(e.target.value) }))}
          className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Restrictions</label>
        <input
          value={form.restrictions}
          onChange={e => setForm(p => ({ ...p, restrictions: e.target.value }))}
          placeholder="e.g. Not suitable for pregnant women"
          className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
        />
      </div>
      <div className="sm:col-span-2 flex gap-3">
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 bg-[#1a4a4a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1e5c5c]"
        >
          <Check size={13} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 border border-[#e0d9cf] text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-base font-bold text-[#1a4a4a]">Delete Service</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <span className="font-semibold text-[#1a4a4a]">{name}</span>?
            This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#e0d9cf] text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<ServiceForm>(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return services.filter(s => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'live' && s.active) ||
        (statusFilter === 'off' && !s.active)
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [services, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyFilter = (newSearch: string, newStatus: string) => {
    setSearch(newSearch)
    setStatusFilter(newStatus)
    setCurrentPage(1)
  }

  const cancel = () => { setEditing(null); setAdding(false); setForm(emptyForm) }

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/services/${editing}` : '/api/services'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
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

  const confirmAndDelete = async () => {
    if (!confirmDelete) return
    const res = await fetch(`/api/services/${confirmDelete.id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    if (!res.ok) { toast.error('Failed to delete'); return }
    setServices(prev => prev.filter(s => s.id !== confirmDelete.id))
    toast.success('Service deleted')
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

  return (
    <>
      {confirmDelete && (
        <DeleteModal
          name={confirmDelete.name}
          onConfirm={confirmAndDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div ref={listRef} className="space-y-3 pb-10">
        {/* Add service + filter bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          {!adding && (
            <button
              onClick={() => { setAdding(true); setEditing(null); setForm(emptyForm) }}
              className="flex items-center gap-2 text-sm bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              <Plus size={15} /> Add Service
            </button>
          )}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => applyFilter(e.target.value, statusFilter)}
              placeholder="Search services…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-[#e0d9cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#237070] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => applyFilter(search, e.target.value)}
            className="text-sm border border-[#e0d9cf] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#237070] text-gray-700"
          >
            <option value="all">All</option>
            <option value="live">Live</option>
            <option value="off">Off</option>
          </select>
        </div>

        {/* Add form */}
        {adding && (
          <div className="bg-white rounded-xl border border-[#237070] p-4">
            <p className="text-sm font-semibold text-[#1a4a4a]">New Service</p>
            <FormFields form={form} setForm={setForm} onSave={save} onCancel={cancel} />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e0d9cf] p-10 text-center">
            <p className="text-gray-400 text-sm">No services match your search.</p>
          </div>
        ) : (
          <>
            {paginated.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm p-4">
                {editing === s.id ? (
                  <>
                    <p className="text-sm font-semibold text-[#1a4a4a]">Editing: {s.name}</p>
                    <FormFields form={form} setForm={setForm} onSave={save} onCancel={cancel} />
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-[#1a4a4a] text-sm">{s.name}</span>
                      {s.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        £{Number(s.price).toFixed(0)} · {s.durationMinutes} min
                        {s.restrictions ? ` · ${s.restrictions}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleActive(s)}
                        title={s.active ? 'Visible on website — click to hide' : 'Hidden from website — click to show'}
                        className="flex items-center gap-1.5 group"
                      >
                        <span className={`text-[10px] font-semibold transition-colors ${s.active ? 'text-[#237070]' : 'text-gray-400'}`}>
                          {s.active ? 'Live' : 'Off'}
                        </span>
                        <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${s.active ? 'bg-[#2a8a8a]' : 'bg-gray-300'}`}>
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${s.active ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                        </div>
                      </button>
                      <button onClick={() => startEdit(s)} title="Edit" className="p-1.5 text-gray-400 hover:text-[#1a4a4a] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete({ id: s.id, name: s.name })} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
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
                      className={`min-w-[30px] h-[30px] text-xs font-semibold rounded-lg border transition-colors ${
                        page === currentPage
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
    </>
  )
}
