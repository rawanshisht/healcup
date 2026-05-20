import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { appointments, shopOrders, shopOrderItems, productVariants } from '@/lib/schema'
import { eq, or } from 'drizzle-orm'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const type = session.metadata?.type

    if (type === 'shop_order') {
      await handleShopOrder(session)
    } else {
      await handleAppointmentDeposit(session)
    }
  }

  return NextResponse.json({ received: true })
}

async function handleAppointmentDeposit(session: Stripe.Checkout.Session) {
  const appointmentId = parseInt(session.metadata?.appointmentId ?? '0')
  const groupId = session.metadata?.groupId ?? null

  if (!appointmentId) return

  // Update all appointments in the group (or just the one if solo booking)
  const whereClause = groupId
    ? or(eq(appointments.groupId, groupId), eq(appointments.id, appointmentId))
    : eq(appointments.id, appointmentId)

  const updated = await db
    .update(appointments)
    .set({ status: 'pending', depositPaid: true, updatedAt: new Date() })
    .where(whereClause!)
    .returning()

  const [appointment] = updated

  if (!appointment) return

  // Send confirmation to every patient in the group who has an email
  const emailTargets = updated.filter(a => a.email)
  if (emailTargets.length > 0 && process.env.RESEND_API_KEY) {
    try {
      const resend     = new Resend(process.env.RESEND_API_KEY)
      const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'
      const fromAddr   = process.env.RESEND_FROM ?? `bookings@clinic.com`

      for (const appt of emailTargets) {
      await resend.emails.send({
        from:    fromAddr,
        to:      appt.email!,
        subject: `Booking Confirmed — ${clinicName}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1c1c1c;">
            <div style="background:#1a4a4a;padding:24px;text-align:center;">
              <h1 style="color:#c9a84c;margin:0;font-size:22px;">${clinicName}</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Cupping Therapy</p>
            </div>
            <div style="padding:28px;">
              <p style="font-size:16px;">As-salamu alaykum <strong>${appt.patientName}</strong>,</p>
              <p>Your £20 deposit has been received and your appointment is confirmed!</p>
              <div style="background:#f0f9f9;border:1px solid #e0d9cf;border-radius:10px;padding:16px;margin:20px 0;">
                <h3 style="margin:0 0 12px;color:#1a4a4a;font-size:14px;">Your Booking</h3>
                <table style="font-size:13px;width:100%;">
                  <tr><td style="color:#666;padding:3px 0;width:120px;">Service</td><td><strong>${appt.serviceName}</strong></td></tr>
                  <tr><td style="color:#666;padding:3px 0;">Date</td><td><strong>${appt.preferredDate}</strong></td></tr>
                  <tr><td style="color:#666;padding:3px 0;">Time</td><td><strong>${appt.preferredTime}</strong></td></tr>
                  <tr><td style="color:#666;padding:3px 0;">Deposit paid</td><td><strong style="color:#1e5c5c;">£20 ✓</strong></td></tr>
                </table>
              </div>
              <div style="background:#fdf6e3;border:1px solid rgba(201,168,76,0.3);border-radius:10px;padding:16px;margin:20px 0;">
                <p style="font-size:13px;font-weight:600;color:#b8892a;margin:0 0 8px;">Before your appointment, please:</p>
                <ul style="font-size:12px;color:#555;margin:0;padding-left:16px;line-height:1.8;">
                  <li>Eat a light meal 2–3 hours before</li>
                  <li>Shower and wear loose, dark-coloured clothing</li>
                  <li>Stay well hydrated</li>
                  <li>Avoid strenuous exercise for 24 hours before</li>
                  <li>Do not shave the treatment area on the day</li>
                </ul>
              </div>
            </div>
            <div style="background:#f4f1eb;padding:16px;text-align:center;font-size:11px;color:#888;">
              © ${new Date().getFullYear()} ${clinicName} · All rights reserved
            </div>
          </div>
        `,
      })
      }
    } catch (emailErr) {
      console.error('Confirmation email failed:', emailErr)
    }
  }
}

async function handleShopOrder(session: Stripe.Checkout.Session) {
  const orderId = parseInt(session.metadata?.orderId ?? '0')
  if (!orderId) return

  const [order] = await db
    .update(shopOrders)
    .set({ status: 'paid' })
    .where(eq(shopOrders.id, orderId))
    .returning()

  if (!order) return

  const items = await db.select().from(shopOrderItems).where(eq(shopOrderItems.orderId, orderId))

  for (const item of items) {
    if (!item.variantId) continue
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, item.variantId))
    if (variant) {
      await db.update(productVariants)
        .set({ stock: Math.max(0, variant.stock - item.quantity) })
        .where(eq(productVariants.id, item.variantId))
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend     = new Resend(process.env.RESEND_API_KEY)
      const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'
      const fromAddr   = process.env.RESEND_FROM ?? `bookings@clinic.com`

      const itemRows = items.map(i =>
        `<tr><td style="padding:4px 0;color:#555;">${i.productName} — ${i.variantLabel} × ${i.quantity}</td><td style="text-align:right;color:#1a4a4a;font-weight:600;">£${(Number(i.unitPrice) * i.quantity).toFixed(2)}</td></tr>`
      ).join('')

      await resend.emails.send({
        from:    fromAddr,
        to:      order.email,
        subject: `Order Confirmed — ${clinicName}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1c1c1c;">
            <div style="background:#1a4a4a;padding:24px;text-align:center;">
              <h1 style="color:#c9a84c;margin:0;font-size:22px;">${clinicName}</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Shop Order Confirmation</p>
            </div>
            <div style="padding:28px;">
              <p style="font-size:16px;">As-salamu alaykum <strong>${order.customerName}</strong>,</p>
              <p>Your order has been received and is being prepared for collection!</p>
              <div style="background:#f0f9f9;border:1px solid #e0d9cf;border-radius:10px;padding:16px;margin:20px 0;">
                <h3 style="margin:0 0 12px;color:#1a4a4a;font-size:14px;">Order #${order.id}</h3>
                <table style="font-size:13px;width:100%;">${itemRows}</table>
                <hr style="border:none;border-top:1px solid #e0d9cf;margin:12px 0;" />
                <table style="font-size:13px;width:100%;">
                  <tr><td style="color:#666;">Total</td><td style="text-align:right;font-weight:700;color:#1a4a4a;">£${Number(order.total).toFixed(2)}</td></tr>
                </table>
              </div>
              <p style="font-size:13px;color:#555;">We will contact you on <strong>${order.phone}</strong> to arrange collection.</p>
            </div>
            <div style="background:#f4f1eb;padding:16px;text-align:center;font-size:11px;color:#888;">
              © ${new Date().getFullYear()} ${clinicName} · All rights reserved
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr)
    }
  }
}
