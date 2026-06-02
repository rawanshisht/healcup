import { Resend } from 'resend'
import type { Appointment } from './schema'

const NAME = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'HealCup'

function resendClient() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
}

function fromAddress() {
  const domain = (process.env.NEXTAUTH_URL ?? 'clinic.com').replace(/https?:\/\//, '')
  return process.env.RESEND_FROM ?? `bookings@${domain}`
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function sendConfirmationNotifications(appt: Appointment) {
  const r = resendClient()
  if (!r || !appt.email) return
  await r.emails.send({
    from: fromAddress(), to: appt.email,
    subject: `Appointment Confirmed — ${NAME}`,
    html: confirmHtml(appt),
  }).catch(err => console.error('Confirmation email failed:', err))
}

export async function send24hReminder(appt: Appointment) {
  const r = resendClient()
  if (!r || !appt.email) return
  await r.emails.send({
    from: fromAddress(), to: appt.email,
    subject: `Reminder: Your appointment is tomorrow — ${NAME}`,
    html: reminder24Html(appt),
  }).catch(err => console.error('Reminder email failed:', err))
}

export async function send16thReminder(email: string | null | undefined, name: string) {
  const r = resendClient()
  if (!r || !email) return
  const bookingUrl = `${process.env.NEXTAUTH_URL ?? ''}/book`
  await r.emails.send({
    from: fromAddress(), to: email,
    subject: `Time for your monthly hijama — ${NAME}`,
    html: monthly16Html(name, bookingUrl),
  }).catch(err => console.error('16th email failed:', err))
}

// ── Email HTML ───────────────────────────────────────────────────────────────

function emailWrap(body: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1c1c1c;">
    <div style="background:#1a4a4a;padding:24px;text-align:center;">
      <h1 style="color:#c9a84c;margin:0;font-size:22px;">${NAME}</h1>
    </div>
    <div style="padding:28px;">${body}</div>
    <div style="background:#f4f1eb;padding:16px;text-align:center;font-size:11px;color:#888;">
      © ${new Date().getFullYear()} ${NAME} · All rights reserved
    </div>
  </div>`
}

function bookingTable(a: Appointment) {
  return `<div style="background:#f0f9f9;border:1px solid #e0d9cf;border-radius:10px;padding:16px;margin:20px 0;">
    <h3 style="margin:0 0 12px;color:#1a4a4a;font-size:14px;">Booking Details</h3>
    <table style="font-size:13px;width:100%;">
      <tr><td style="color:#666;padding:3px 0;width:120px;">Service</td><td><strong>${a.serviceName}</strong></td></tr>
      <tr><td style="color:#666;padding:3px 0;">Date</td><td><strong>${a.preferredDate}</strong></td></tr>
      <tr><td style="color:#666;padding:3px 0;">Time</td><td><strong>${a.preferredTime}</strong></td></tr>
    </table>
  </div>`
}

function preApptBox() {
  return `<div style="background:#fdf6e3;border:1px solid rgba(201,168,76,0.3);border-radius:10px;padding:16px;margin:20px 0;">
    <p style="font-size:13px;font-weight:600;color:#b8892a;margin:0 0 8px;">Before your appointment:</p>
    <ul style="font-size:12px;color:#555;margin:0;padding-left:16px;line-height:1.8;">
      <li>Eat a light meal 2–3 hours before</li>
      <li>Shower and wear loose, dark-coloured clothing</li>
      <li>Stay well hydrated</li>
      <li>Avoid strenuous exercise for 24 hours before</li>
    </ul>
  </div>`
}

function confirmHtml(a: Appointment) {
  return emailWrap(`
    <p style="font-size:16px;">As-salamu alaykum <strong>${a.patientName}</strong>,</p>
    <p>Your appointment has been <strong style="color:#1a4a4a;">confirmed</strong>. We look forward to seeing you.</p>
    ${bookingTable(a)}
    ${preApptBox()}
    <p style="font-size:12px;color:#888;">To cancel or reschedule, please contact us at least 24 hours before your appointment.</p>
  `)
}

function reminder24Html(a: Appointment) {
  return emailWrap(`
    <p style="font-size:16px;">As-salamu alaykum <strong>${a.patientName}</strong>,</p>
    <p>This is a friendly reminder that your hijama appointment is <strong>tomorrow</strong>.</p>
    ${bookingTable(a)}
    ${preApptBox()}
  `)
}

function monthly16Html(name: string, bookingUrl: string) {
  return emailWrap(`
    <p style="font-size:16px;">As-salamu alaykum <strong>${name}</strong>,</p>
    <p>The middle of the month is among the most recommended times for hijama. If you haven't booked your next session, now is a great time to take care of your health.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${bookingUrl}" style="background:#c9a84c;color:#fff;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;">Book Your Session</a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">Regular sessions support your overall wellbeing. We look forward to welcoming you.</p>
  `)
}
