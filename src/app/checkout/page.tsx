'use client'

import { useState, useEffect } from 'react'
import { useCart, cartKey } from '@/context/cart'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items.length, router])

  if (items.length === 0) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          items: items.map(i => ({
            variantId: i.variantId,
            productId: i.productId,
            productName: i.productName,
            variantLabel: i.variantLabel,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Checkout failed'); setLoading(false); return }
      window.location.href = data.url
    } catch {
      toast.error('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="container-site py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to cart
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {/* Form */}
            <div className="sm:col-span-3">
              <div className="bg-white rounded-2xl border border-[#e0d9cf] p-6">
                <h1 className="text-xl font-bold text-[#1a4a4a] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Checkout</h1>
                <p className="text-xs text-gray-400 mb-6">Enter your details — we'll contact you to arrange collection.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Full name *</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      required
                      className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
                      placeholder="+44 7700 000000"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a4a4a] hover:bg-[#1e5c5c] disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
                  >
                    <Lock size={14} />
                    {loading ? 'Redirecting to payment…' : `Pay £${total.toFixed(2)}`}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Secured by Stripe</p>
                </form>
              </div>
            </div>

            {/* Order summary */}
            <div className="sm:col-span-2">
              <div className="bg-white rounded-2xl border border-[#e0d9cf] p-5">
                <h2 className="text-sm font-semibold text-[#1a4a4a] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={cartKey(item)} className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-700">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.variantLabel} × {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#1a4a4a]">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e0d9cf] pt-3 flex justify-between">
                  <span className="font-semibold text-[#1a4a4a]">Total</span>
                  <span className="font-bold text-[#1a4a4a]">£{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#237070] mt-2 font-medium">Collection — Free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
