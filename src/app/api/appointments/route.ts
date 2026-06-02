import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { appointments } from '@/lib/schema'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  serviceId:       z.number(),
  serviceName:     z.string(),
  patientName:     z.string().min(2),
  phone:           z.string().min(7),
  email:           z.string().email().nullable().optional(),
  gender:          z.enum(['male', 'female']),
  preferredDate:   z.string(),
  preferredTime:   z.string(),
  reason:          z.string().nullable().optional(),
  howHeard:        z.string().nullable().optional(),
  screeningAnswers: z.record(z.string(), z.union([z.boolean(), z.string().nullable(), z.null()])),
  consentGiven:    z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const [appointment] = await db
      .insert(appointments)
      .values({
        serviceId:       data.serviceId,
        serviceName:     data.serviceName,
        patientName:     data.patientName,
        phone:           data.phone,
        email:           data.email ?? null,
        gender:          data.gender,
        preferredDate:   data.preferredDate,
        preferredTime:   data.preferredTime,
        reason:          data.reason ?? null,
        howHeard:        data.howHeard ?? null,
        screeningAnswers: data.screeningAnswers,
        consentGiven:    data.consentGiven,
        status:          'pending',
      })
      .returning()

    // Send confirmation email (fire and forget)
    if (data.email && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'HealCup'
        await resend.emails.send({
          from:    process.env.RESEND_FROM ?? `bookings@${process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') ?? 'clinic.com'}`,
          to:      data.email,
          subject: `Appointment Request Received — ${clinicName}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1c1c1c;">
              <div style="background:#1a4a4a;padding:24px;text-align:center;">
                <h1 style="color:#c9a84c;margin:0;font-size:22px;">${clinicName}</h1>
                <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Cupping Therapy</p>
              </div>
              <div style="padding:28px;">
                <p style="font-size:16px;">As-salamu alaykum <strong>${data.patientName}</strong>,</p>
                <p>JazakAllahu Khayran — we have received your appointment request and will confirm shortly via WhatsApp or email.</p>
                <div style="background:#f0f9f9;border:1px solid #e0d9cf;border-radius:10px;padding:16px;margin:20px 0;">
                  <h3 style="margin:0 0 12px;color:#1a4a4a;font-size:14px;">Your Booking Details</h3>
                  <table style="font-size:13px;width:100%;">
                    <tr><td style="color:#666;padding:3px 0;width:120px;">Service</td><td><strong>${data.serviceName}</strong></td></tr>
                    <tr><td style="color:#666;padding:3px 0;">Date</td><td><strong>${data.preferredDate}</strong></td></tr>
                    <tr><td style="color:#666;padding:3px 0;">Time</td><td><strong>${data.preferredTime}</strong></td></tr>
                    <tr><td style="color:#666;padding:3px 0;">Payment</td><td>Cash or card at the clinic</td></tr>
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
                <p style="font-size:12px;color:#888;">If you need to cancel or reschedule, please contact us at least 24 hours before your appointment.</p>
              </div>
              <div style="background:#f4f1eb;padding:16px;text-align:center;font-size:11px;color:#888;">
                © ${new Date().getFullYear()} ${clinicName} · All rights reserved
              </div>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true, id: appointment.id })
  } catch (err) {
    console.error('Appointment creation error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
