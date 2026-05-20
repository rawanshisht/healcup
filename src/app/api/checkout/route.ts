import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { and, eq, ne, sql } from 'drizzle-orm'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const DEPOSIT_PENCE = 2000 // £20 per person
const SLOT_CAPACITY = 3

const patientSchema = z.object({
  name:             z.string().min(2),
  phone:            z.string().min(7),
  email:            z.string().email().nullable().optional(),
  gender:           z.enum(['male', 'female']),
  reason:           z.string().nullable().optional(),
  screeningAnswers: z.record(z.string(), z.union([z.boolean(), z.string().nullable(), z.null()])),
})

const schema = z.object({
  serviceId:     z.number(),
  serviceName:   z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  howHeard:      z.string().nullable().optional(),
  consentGiven:  z.boolean(),
  patients:      z.array(patientSchema).min(1).max(3),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Check slot availability (race-condition guard)
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(appointments)
      .where(
        and(
          eq(appointments.preferredDate, data.preferredDate),
          eq(appointments.preferredTime, data.preferredTime),
          ne(appointments.status, 'cancelled'),
        )
      )

    if (count > 0) {
      return NextResponse.json(
        { error: 'This time slot is now fully booked. Please choose a different time.' },
        { status: 409 }
      )
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const groupId = crypto.randomUUID()

    // Insert one appointment row per patient
    const inserted = await db
      .insert(appointments)
      .values(
        data.patients.map(p => ({
          serviceId:        data.serviceId,
          serviceName:      data.serviceName,
          patientName:      p.name,
          phone:            p.phone,
          email:            p.email ?? null,
          gender:           p.gender,
          preferredDate:    data.preferredDate,
          preferredTime:    data.preferredTime,
          reason:           p.reason ?? null,
          howHeard:         data.howHeard ?? null,
          screeningAnswers: p.screeningAnswers,
          consentGiven:     data.consentGiven,
          groupId,
          status:           'awaiting_payment',
        }))
      )
      .returning()

    const totalPence = DEPOSIT_PENCE
    const primaryPatient = data.patients[0]
    const desc = data.patients.length > 1
      ? `${data.patients.map(p => p.name).join(', ')}`
      : `${data.preferredDate} at ${data.preferredTime}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Appointment Deposit — ${data.serviceName}`,
            description: desc,
          },
          unit_amount: totalPence,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: primaryPatient.email || undefined,
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/book/cancel`,
      metadata: {
        appointmentId: String(inserted[0].id),
        groupId,
      },
    })

    // Store session ID on all appointments in the group
    await db
      .update(appointments)
      .set({ stripeSessionId: session.id })
      .where(eq(appointments.groupId, groupId))

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
