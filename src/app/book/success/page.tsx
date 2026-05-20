import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { eq, or } from 'drizzle-orm'
import { CheckCircle2, Phone, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Booking Confirmed' }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) redirect('/book')

  let appointment: typeof appointments.$inferSelect | null = null

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    if (session.payment_status !== 'paid') redirect('/book')

    const appointmentId = parseInt(session.metadata?.appointmentId ?? '0')
    const groupId = session.metadata?.groupId ?? null

    if (appointmentId) {
      // Mark all appointments in the group as paid (idempotent — safe if webhook already ran)
      const whereClause = groupId
        ? or(eq(appointments.groupId, groupId), eq(appointments.id, appointmentId))
        : eq(appointments.id, appointmentId)

      await db
        .update(appointments)
        .set({ status: 'pending', depositPaid: true, updatedAt: new Date() })
        .where(whereClause!)

      const rows = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
      appointment = rows[0] ?? null
    }
  } catch {
    redirect('/book')
  }

  const clinicPhone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''
  const waNumber    = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  return (
    <section className="py-12 sm:py-16 pattern-light min-h-[70vh] flex items-center">
      <div className="container-site max-w-lg mx-auto">
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#e6e2d8]">
          <div className="h-1.5" style={{ background: 'linear-gradient(to right, #1a4a4a, #2a8a8a, #1a4a4a)' }} />

          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#e6f4f4]">
              <CheckCircle2 size={32} className="text-[#1a4a4a]" />
            </div>
            <h1 className="text-2xl font-bold mb-1 text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
              Booking Confirmed
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your £20 deposit has been received. See you soon!
            </p>

            {appointment && (
              <div className="rounded-xl overflow-hidden max-w-sm mx-auto mb-6 border border-[#e6e2d8]">
                <div className="px-4 py-3 bg-[#1a4a4a]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Your Booking</p>
                </div>
                <div className="divide-y divide-[#f0ece4] bg-white">
                  {[
                    ['Service',  appointment.serviceName],
                    ['Name',     appointment.patientName],
                    ['Date',     appointment.preferredDate],
                    ['Time',     appointment.preferredTime],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-semibold text-[#1a2420]">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-sm text-gray-400">Deposit paid</span>
                    <span className="font-bold text-sm text-[#1e5c5c]">£20 ✓</span>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl p-4 bg-[#1a4a4a] text-left max-w-sm mx-auto mb-5">
              <p className="font-semibold mb-1.5 text-white text-sm">Before your appointment</p>
              <ul className="space-y-1.5 text-xs text-white/75">
                <li>✓ Eat a light meal 2–3 hours before</li>
                <li>✓ Wear loose, dark-coloured clothing</li>
                <li>✓ Stay well hydrated throughout the day</li>
                <li>✓ Avoid strenuous exercise 24 hours before</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('As-salamu alaykum, I just booked an appointment and my deposit has been paid.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm transition-colors"
                >
                  <MessageCircle size={16} /> Message us on WhatsApp
                </a>
              )}
              {clinicPhone && (
                <a
                  href={`tel:${clinicPhone}`}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-[#e0d9cf] hover:border-[#2a8a8a] text-[#1a4a4a] font-semibold text-sm transition-colors"
                >
                  <Phone size={16} /> Call us: {clinicPhone}
                </a>
              )}
              <Link
                href="/"
                className="py-3 px-5 rounded-xl bg-[#f0ece4] hover:bg-[#e6e2d8] text-[#4a5e58] font-semibold text-sm transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
