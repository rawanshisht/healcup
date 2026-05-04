import Link from 'next/link'
import { XCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payment Cancelled' }

export default function BookingCancelPage() {
  return (
    <section className="py-12 sm:py-16 pattern-light min-h-[70vh] flex items-center">
      <div className="container-site max-w-md mx-auto text-center">
        <div className="rounded-2xl bg-white border border-[#e6e2d8] shadow-sm p-8">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Payment Cancelled
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            No charge was made. Your appointment has not been confirmed — please complete payment to secure your slot.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/book"
              className="py-3 px-5 rounded-xl bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="py-3 px-5 rounded-xl border border-[#e0d9cf] hover:border-[#2a8a8a] text-[#4a5e58] font-semibold text-sm transition-colors"
            >
              Contact Us Instead
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
