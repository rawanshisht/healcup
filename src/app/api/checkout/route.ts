import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const DEPOSIT_PENCE = 2000 // £20

const schema = z.object({
  serviceId:        z.number(),
  serviceName:      z.string(),
  patientName:      z.string().min(2),
  phone:            z.string().min(7),
  email:            z.string().email().nullable().optional(),
  gender:           z.enum(['male', 'female']),
  preferredDate:    z.string(),
  preferredTime:    z.string(),
  reason:           z.string().nullable().optional(),
  howHeard:         z.string().nullable().optional(),
  screeningAnswers: z.record(z.string(), z.union([z.boolean(), z.string().nullable(), z.null()])),
  consentGiven:     z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const [appointment] = await db
      .insert(appointments)
      .values({
        serviceId:        data.serviceId,
        serviceName:      data.serviceName,
        patientName:      data.patientName,
        phone:            data.phone,
        email:            data.email ?? null,
        gender:           data.gender,
        preferredDate:    data.preferredDate,
        preferredTime:    data.preferredTime,
        reason:           data.reason ?? null,
        howHeard:         data.howHeard ?? null,
        screeningAnswers: data.screeningAnswers,
        consentGiven:     data.consentGiven,
        status:           'awaiting_payment',
      })
      .returning()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Appointment Deposit — ${data.serviceName}`,
            description: `${data.preferredDate} at ${data.preferredTime} · ${data.patientName}`,
          },
          unit_amount: DEPOSIT_PENCE,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: data.email || undefined,
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/book/cancel`,
      metadata: { appointmentId: String(appointment.id) },
    })

    await db
      .update(appointments)
      .set({ stripeSessionId: session.id })
      .where(eq(appointments.id, appointment.id))

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
