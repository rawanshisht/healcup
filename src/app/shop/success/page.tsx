import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stripe from 'stripe'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed' }

export default async function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>
}) {
  const { session_id, order_id } = await searchParams

  if (!session_id) redirect('/shop')

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    if (session.payment_status !== 'paid') redirect('/shop')
  } catch {
    redirect('/shop')
  }

  return (
    <div className="min-h-[70vh] bg-[#f4f1eb] flex items-center justify-center py-16">
      <div className="bg-white rounded-2xl border border-[#e0d9cf] shadow-sm p-10 text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-[#237070]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Order Confirmed!
        </h1>
        <p className="text-gray-500 text-sm mb-1">Your order has been placed successfully.</p>
        {order_id && <p className="text-xs text-gray-400 mb-6">Order #{order_id}</p>}
        <p className="text-sm text-gray-500 mb-8">
          We&apos;ve sent a confirmation to your email. We&apos;ll be in touch to arrange collection.
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
