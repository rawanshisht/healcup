'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import type { Product, ProductVariant } from '@/lib/schema'

type ProductWithVariants = Product & { variants: ProductVariant[] }

type ProductForm = { name: string; description: string; imageUrl: string; price: string; stock: string; active: boolean; sortOrder: number }
type VariantForm = { label: string; price: string; stock: string }

const emptyProduct: ProductForm = { name: '', description: '', imageUrl: '', price: '', stock: '0', active: true, sortOrder: 0 }
const emptyVariant: VariantForm = { label: '', price: '', stock: '0' }

function DeleteModal({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h2 className="text-base font-bold text-[#1a4a4a] mb-2">Delete {label}?</h2>
        <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-[#e0d9cf] text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsManager({ initialProducts }: { initialProducts: ProductWithVariants[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [addingProduct, setAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct)
  const [addingVariant, setAddingVariant] = useState<number | null>(null)
  const [editingVariant, setEditingVariant] = useState<number | null>(null)
  const [variantForm, setVariantForm] = useState<VariantForm>(emptyVariant)
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'product' | 'variant'; id: number; label: string } | null>(null)

  const saveProduct = async () => {
    if (!productForm.name.trim()) { toast.error('Name is required'); return }
    const method = editingProduct ? 'PUT' : 'POST'
    const url = editingProduct ? `/api/products/${editingProduct}` : '/api/products'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...productForm, imageUrl: productForm.imageUrl || null, price: productForm.price || null, stock: parseInt(productForm.stock) || 0 }),
    })
    if (!res.ok) { toast.error('Failed to save'); return }
    const data = await res.json()
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct ? { ...data, variants: p.variants } : p))
      setEditingProduct(null)
    } else {
      setProducts(prev => [...prev, { ...data, variants: [] }])
      setAddingProduct(false)
      setExpanded(data.id)
    }
    setProductForm(emptyProduct)
    toast.success('Product saved')
  }

  const deleteProduct = async () => {
    if (!confirmDelete || confirmDelete.type !== 'product') return
    const res = await fetch(`/api/products/${confirmDelete.id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    if (!res.ok) { toast.error('Failed to delete'); return }
    setProducts(prev => prev.filter(p => p.id !== confirmDelete.id))
    toast.success('Product deleted')
  }

  const toggleActive = async (p: ProductWithVariants) => {
    const res = await fetch(`/api/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, active: !p.active, imageUrl: p.imageUrl || null, price: p.price || null, stock: p.stock }),
    })
    if (res.ok) setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
  }

  const saveVariant = async (productId: number) => {
    if (!variantForm.label.trim() || !variantForm.price) { toast.error('Label and price are required'); return }
    const method = editingVariant ? 'PUT' : 'POST'
    const url = editingVariant ? `/api/product-variants/${editingVariant}` : '/api/product-variants'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, label: variantForm.label, price: parseFloat(variantForm.price), stock: parseInt(variantForm.stock) || 0 }),
    })
    if (!res.ok) { toast.error('Failed to save variant'); return }
    const data = await res.json()
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p
      if (editingVariant) return { ...p, variants: p.variants.map(v => v.id === editingVariant ? data : v) }
      return { ...p, variants: [...p.variants, data] }
    }))
    setAddingVariant(null)
    setEditingVariant(null)
    setVariantForm(emptyVariant)
    toast.success('Variant saved')
  }

  const deleteVariant = async () => {
    if (!confirmDelete || confirmDelete.type !== 'variant') return
    const res = await fetch(`/api/product-variants/${confirmDelete.id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    if (!res.ok) { toast.error('Failed to delete variant'); return }
    setProducts(prev => prev.map(p => ({ ...p, variants: p.variants.filter(v => v.id !== confirmDelete.id) })))
    toast.success('Variant deleted')
  }

  return (
    <>
      {confirmDelete && (
        <DeleteModal
          label={confirmDelete.label}
          onConfirm={confirmDelete.type === 'product' ? deleteProduct : deleteVariant}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="space-y-3 pb-10">
        {/* Add product button */}
        {!addingProduct && (
          <button
            onClick={() => { setAddingProduct(true); setEditingProduct(null); setProductForm(emptyProduct) }}
            className="flex items-center gap-2 text-sm bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add Product
          </button>
        )}

        {/* Add product form */}
        {addingProduct && (
          <div className="bg-white rounded-xl border border-[#237070] p-4">
            <p className="text-sm font-semibold text-[#1a4a4a] mb-3">New Product</p>
            <ProductFormFields form={productForm} setForm={setProductForm} onSave={saveProduct} onCancel={() => { setAddingProduct(false); setProductForm(emptyProduct) }} />
          </div>
        )}

        {/* Product list */}
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm overflow-hidden">
            {editingProduct === p.id ? (
              <div className="p-4">
                <p className="text-sm font-semibold text-[#1a4a4a] mb-3">Editing: {p.name}</p>
                <ProductFormFields form={productForm} setForm={setProductForm} onSave={saveProduct} onCancel={() => { setEditingProduct(null); setProductForm(emptyProduct) }} />
              </div>
            ) : (
              <>
                {/* Product header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#f8f8f8]"
                  onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#f4f1eb] flex items-center justify-center shrink-0 overflow-hidden">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🍯</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1a4a4a] text-sm">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {p.price ? `£${Number(p.price).toFixed(2)} · ` : ''}{p.stock} in stock · {p.variants.length} variant{p.variants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={e => { e.stopPropagation(); toggleActive(p) }} className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold ${p.active ? 'text-[#237070]' : 'text-gray-400'}`}>{p.active ? 'Live' : 'Off'}</span>
                      <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.active ? 'bg-[#2a8a8a]' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${p.active ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                      </div>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setEditingProduct(p.id); setProductForm({ name: p.name, description: p.description ?? '', imageUrl: p.imageUrl ?? '', price: p.price ?? '', stock: String(p.stock), active: p.active, sortOrder: p.sortOrder }) }} className="p-1.5 text-gray-400 hover:text-[#1a4a4a]"><Pencil size={14} /></button>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete({ type: 'product', id: p.id, label: p.name }) }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    {expanded === p.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {/* Variants panel */}
                {expanded === p.id && (
                  <div className="border-t border-[#e0d9cf] p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Variants</p>

                    {p.variants.map(v => (
                      <div key={v.id} className="flex items-center justify-between bg-[#f8f8f8] rounded-lg px-3 py-2.5">
                        {editingVariant === v.id ? (
                          <div className="flex-1">
                            <VariantFormFields form={variantForm} setForm={setVariantForm} onSave={() => saveVariant(p.id)} onCancel={() => { setEditingVariant(null); setVariantForm(emptyVariant) }} />
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-semibold text-[#1a4a4a]">{v.label}</p>
                              <p className="text-xs text-gray-400">£{Number(v.price).toFixed(2)} · {v.stock} in stock</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => { setEditingVariant(v.id); setVariantForm({ label: v.label, price: String(v.price), stock: String(v.stock) }) }} className="p-1.5 text-gray-400 hover:text-[#1a4a4a]"><Pencil size={13} /></button>
                              <button onClick={() => setConfirmDelete({ type: 'variant', id: v.id, label: `${v.label} variant` })} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {addingVariant === p.id ? (
                      <div className="bg-[#f0f9f9] rounded-lg p-3">
                        <VariantFormFields form={variantForm} setForm={setVariantForm} onSave={() => saveVariant(p.id)} onCancel={() => { setAddingVariant(null); setVariantForm(emptyVariant) }} />
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingVariant(p.id); setEditingVariant(null); setVariantForm(emptyVariant) }}
                        className="flex items-center gap-1.5 text-xs text-[#237070] hover:text-[#1a4a4a] font-semibold transition-colors"
                      >
                        <Plus size={13} /> Add Variant
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function ProductFormFields({ form, setForm, onSave, onCancel }: {
  form: ProductForm
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-gray-500 block mb-1">Name *</label>
        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Image URL</label>
        <input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://…" className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Price (£)</label>
        <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="9.99" className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Stock</label>
        <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs text-gray-500 block mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070] resize-none" />
      </div>
      <div className="sm:col-span-2 flex gap-3">
        <button onClick={onSave} className="flex items-center gap-1.5 bg-[#1a4a4a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1e5c5c]"><Check size={13} /> Save</button>
        <button onClick={onCancel} className="flex items-center gap-1.5 border border-[#e0d9cf] text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"><X size={13} /> Cancel</button>
      </div>
    </div>
  )
}

function VariantFormFields({ form, setForm, onSave, onCancel }: {
  form: VariantForm
  setForm: React.Dispatch<React.SetStateAction<VariantForm>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="text-xs text-gray-500 block mb-1">Label *</label>
        <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. 250g" className="w-24 border border-[#e0d9cf] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Price (£) *</label>
        <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="9.99" className="w-20 border border-[#e0d9cf] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">Stock</label>
        <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="w-16 border border-[#e0d9cf] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]" />
      </div>
      <div className="flex gap-1.5">
        <button onClick={onSave} className="flex items-center gap-1 bg-[#1a4a4a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#1e5c5c]"><Check size={12} /> Save</button>
        <button onClick={onCancel} className="flex items-center gap-1 border border-[#e0d9cf] text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50"><X size={12} /> Cancel</button>
      </div>
    </div>
  )
}
