import type { Metadata } from 'next'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'
import BookingForm from './BookingForm'

export const metadata: Metadata = { title: 'Book an Appointment' }

export default async function BookPage() {
  const activeServices = await db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(asc(services.sortOrder))

  return (
    <>
      <section className="pattern-bg relative py-16 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Easy Online Booking</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Book an Appointment</h1>
          <p className="text-white/70 text-sm mt-3 max-w-xl mx-auto">
            Fill in the form below. We will review your request and confirm via WhatsApp or email within a few hours.
          </p>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-12 pattern-light">
        <div className="container-site max-w-2xl mx-auto">
          <Suspense fallback={<div className="bg-white rounded-2xl border border-[#e0d9cf] p-10 text-center text-gray-400 text-sm">Loading booking form...</div>}>
            <BookingForm services={activeServices} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
