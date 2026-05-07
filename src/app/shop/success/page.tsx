'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/cart'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const { clearCart } = useCart()
  const params = useSearchParams()
  const orderId = params.get('order_id')

  useEffect(() => { clearCart() }, [clearCart])

  return (
    <div className="min-h-screen bg-[#f4f1eb] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-[#e0d9cf] shadow-sm p-10 text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-[#237070]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Order Confirmed!
        </h1>
        <p className="text-gray-500 text-sm mb-1">Your order has been placed successfully.</p>
        {orderId && <p className="text-xs text-gray-400 mb-6">Order #{orderId}</p>}
        <p className="text-sm text-gray-500 mb-8">
          We've sent a confirmation to your email. We'll be in touch to arrange collection.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            className="bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Continue Shopping
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ShopSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
