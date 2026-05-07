'use client'

import { useCart, cartKey } from '@/context/cart'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f1eb] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Your cart is empty</h1>
          <p className="text-gray-400 text-sm mb-6">Browse our shop to add products.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="container-site py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Your Cart</h1>
            <p className="text-sm text-gray-400 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={cartKey(item)} className="bg-white rounded-xl border border-[#e0d9cf] p-4 flex items-center gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-[#f4f1eb] flex items-center justify-center shrink-0 relative overflow-hidden">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <span className="text-2xl">🍯</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a4a4a] text-sm">{item.productName}</p>
                  <p className="text-xs text-gray-400">{item.variantLabel}</p>
                  <p className="text-sm font-bold text-[#1a4a4a] mt-1">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(cartKey(item), item.quantity - 1)}
                    className="w-7 h-7 rounded-lg border border-[#e0d9cf] flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(cartKey(item), item.quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-[#e0d9cf] flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(cartKey(item))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-[#e0d9cf] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-bold text-[#1a4a4a]">£{total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e0d9cf]">
              <span className="text-sm text-gray-500">Collection</span>
              <span className="text-sm font-semibold text-[#237070]">Free</span>
            </div>
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-[#1a4a4a]">Total</span>
              <span className="text-xl font-bold text-[#1a4a4a]">£{total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
