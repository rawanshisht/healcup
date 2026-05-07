'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ShopOrder, ShopOrderItem } from '@/lib/schema'

type OrderWithItems = ShopOrder & { items: ShopOrderItem[] }

const STATUS_STYLES: Record<string, string> = {
  pending_payment: 'bg-blue-50 text-blue-700 border-blue-200',
  paid:            'bg-[#e6f4f4] text-[#1e5c5c] border-[#2a8a8a]/40',
  fulfilled:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:       'bg-red-50 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  paid:            'Paid',
  fulfilled:       'Fulfilled',
  cancelled:       'Cancelled',
}

export default function OrdersList({ initialOrders }: { initialOrders: OrderWithItems[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [expanded, setExpanded] = useState<number | null>(null)

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/shop/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      toast.success(`Order marked as ${STATUS_LABELS[status] ?? status}`)
    } else {
      toast.error('Failed to update')
    }
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e0d9cf] p-12 text-center">
        <p className="text-2xl mb-2">📦</p>
        <p className="text-gray-500 text-sm font-medium">No orders yet</p>
        <p className="text-gray-400 text-xs mt-1">Orders will appear here once customers purchase from the shop.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-10">
      {orders.map(o => (
        <div key={o.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#f8f8f8]"
            onClick={() => setExpanded(expanded === o.id ? null : o.id)}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[o.status] ?? o.status}
              </span>
              <div>
                <p className="font-semibold text-[#1a4a4a] text-sm">{o.customerName}</p>
                <p className="text-xs text-gray-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · £{Number(o.total).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden sm:block">
                #{o.id} · {format(new Date(o.createdAt), 'dd MMM yyyy')}
              </span>
              {expanded === o.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </div>
          </div>

          {expanded === o.id && (
            <div className="border-t border-[#e0d9cf] p-4 space-y-4">
              {/* Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><span className="text-xs text-gray-400">Email:</span> <a href={`mailto:${o.email}`} className="text-[#1e5c5c] hover:underline">{o.email}</a></p>
                <p><span className="text-xs text-gray-400">Phone:</span> <a href={`tel:${o.phone}`} className="text-[#1e5c5c] hover:underline">{o.phone}</a></p>
              </div>

              {/* Items */}
              <div className="bg-[#f8f8f8] rounded-lg p-3 space-y-2">
                {o.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.productName} — {item.variantLabel} × {item.quantity}</span>
                    <span className="font-semibold text-[#1a4a4a]">£{(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#e0d9cf] pt-2 flex justify-between text-sm font-bold text-[#1a4a4a]">
                  <span>Total</span>
                  <span>£{Number(o.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {o.status === 'paid' && (
                  <button onClick={() => updateStatus(o.id, 'fulfilled')} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    ✓ Mark Fulfilled
                  </button>
                )}
                {o.status === 'fulfilled' && (
                  <button onClick={() => updateStatus(o.id, 'paid')} className="text-xs bg-[#237070] hover:bg-[#1e5c5c] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Revert to Paid
                  </button>
                )}
                {o.status !== 'cancelled' && o.status !== 'fulfilled' && (
                  <button onClick={() => updateStatus(o.id, 'cancelled')} className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                    Cancel Order
                  </button>
                )}
                <a
                  href={`https://wa.me/${o.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${o.customerName}, your order #${o.id} from ${process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'our shop'} is ready for collection. Please get in touch to arrange a convenient time.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  WhatsApp Customer
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
