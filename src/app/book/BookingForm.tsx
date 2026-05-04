'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertTriangle, MessageCircle, Lock, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react'
import type { Service } from '@/lib/schema'

const SCREENING_QUESTIONS = [
  { id: 'blood_thinners',      label: 'Blood thinners or anticoagulant medication',   detail: 'e.g. warfarin, rivaroxaban, daily aspirin' },
  { id: 'high_blood_pressure', label: 'High blood pressure (hypertension)',            detail: 'currently diagnosed with or being treated for high blood pressure' },
  { id: 'skin_infection',      label: 'Active skin infection or open wound',           detail: 'at or near the intended treatment area' },
  { id: 'fever',               label: 'Fever, flu, or acute illness',                  detail: 'currently unwell on the day of booking' },
  { id: 'pregnant',            label: 'Pregnancy',                                     detail: 'currently pregnant or trying to conceive' },
  { id: 'anaemia',             label: 'Severe anaemia or blood/clotting disorder',     detail: 'diagnosed condition affecting blood' },
  { id: 'recent_surgery',      label: 'Surgery within the last 4 weeks',              detail: 'any surgical procedure in the past month' },
]

const LAST_HIJAMA_OPTIONS = [
  'This will be my first hijama session',
  'Less than 1 month ago',
  '1–3 months ago',
  '3–6 months ago',
  'More than 6 months ago',
  "I'm not sure",
]

const DEPOSIT_AMOUNT = 20

const D_HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const D_MINS  = ['00', '30']
const D_AMPM  = ['AM', 'PM']

function ArrowTimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parse = (v: string) => {
    const m = v.match(/^(\d+):(\d+)\s*(AM|PM)/i)
    return m ? { h: m[1], mi: m[2], ap: m[3].toUpperCase() as 'AM' | 'PM' } : { h: '9', mi: '00', ap: 'AM' as const }
  }
  const init = parse(value || '')
  const [hour, setHour] = useState(init.h)
  const [min,  setMin]  = useState(init.mi)
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(init.ap)

  useEffect(() => { onChange(`${hour}:${min} ${ampm}`) }, [hour, min, ampm])

  const cycle = (items: string[], current: string, dir: 1 | -1) =>
    items[(items.indexOf(current) + dir + items.length) % items.length]

  const btn = 'p-1 rounded hover:bg-[#e6f4f4] text-[#4a5e58] hover:text-[#1a4a4a] transition-colors flex items-center justify-center'

  return (
    <div
      className="flex items-center w-full rounded-xl px-3 py-3 text-sm"
      style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
    >
      <button type="button" className={btn} onClick={() => setHour(cycle(D_HOURS, hour, -1))}><ChevronLeft size={13} /></button>
      <span className="w-7 text-center font-bold" style={{ color: '#1a4a4a' }}>{hour}</span>
      <button type="button" className={btn} onClick={() => setHour(cycle(D_HOURS, hour, 1))}><ChevronRight size={13} /></button>

      <span className="mx-1 font-bold" style={{ color: '#4a5e58' }}>:</span>

      <button type="button" className={btn} onClick={() => setMin(cycle(D_MINS, min, -1))}><ChevronLeft size={13} /></button>
      <span className="w-8 text-center font-bold" style={{ color: '#1a4a4a' }}>{min}</span>
      <button type="button" className={btn} onClick={() => setMin(cycle(D_MINS, min, 1))}><ChevronRight size={13} /></button>

      <div className="flex-1" />

      <button type="button" className={btn} onClick={() => setAmpm(cycle(D_AMPM, ampm, -1) as 'AM' | 'PM')}><ChevronLeft size={13} /></button>
      <span className="w-9 text-center font-bold" style={{ color: '#1a4a4a' }}>{ampm}</span>
      <button type="button" className={btn} onClick={() => setAmpm(cycle(D_AMPM, ampm, 1) as 'AM' | 'PM')}><ChevronRight size={13} /></button>
    </div>
  )
}

const schema = z.object({
  serviceId: z.string().min(1, 'Please choose a service above'),
  patientName: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email').or(z.literal('')),
  gender: z.enum(['male', 'female'], 'Please select your gender'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  reason: z.string().optional(),
  howHeard: z.string().optional(),
  blood_thinners: z.boolean(),
  high_blood_pressure: z.boolean(),
  skin_infection: z.boolean(),
  fever: z.boolean(),
  pregnant: z.boolean(),
  anaemia: z.boolean(),
  recent_surgery: z.boolean(),
  lastHijama: z.string().min(1, 'Please select when you last had a hijama session'),
  consent: z.boolean().refine(v => v === true, 'Please agree to the consent form to continue'),
})

type FormData = z.infer<typeof schema>

const CONSENT_POINTS = [
  'Hijama is a complementary therapy — not a substitute for medical diagnosis or treatment.',
  'I confirm the information I have provided is accurate and complete.',
  'I understand that temporary bruising and skin marks are a normal part of treatment.',
  'I consent to treatment and understand the practitioner may pause or stop if needed for my safety.',
  'I have read the pre-appointment and aftercare instructions.',
  `The £${DEPOSIT_AMOUNT} deposit is non-refundable if I cancel within 1–2 hours of my scheduled appointment time.`,
]

function GoldCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="7.5" stroke="#c9a84c" strokeWidth="1" />
      <path d="M5 8l2 2 4-4" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span style={{ fontSize: 10, letterSpacing: '2.5px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: '#e6e2d8' }} />
    </div>
  )
}

export default function BookingForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams()
  const defaultService = searchParams.get('service') ?? ''
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const clinicPhone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''

  const [step, setStep] = useState(1)
  const [flagged, setFlagged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [howHeard, setHowHeard] = useState('')

  const {
    register, handleSubmit, watch, trigger, setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultService,
      email: '',
      blood_thinners: false, high_blood_pressure: false, skin_infection: false,
      fever: false, pregnant: false, anaemia: false, recent_surgery: false,
      lastHijama: '',
      consent: false,
    },
  })

  const selectedServiceId = watch('serviceId')
  const selectedService = services.find(s => String(s.id) === selectedServiceId)
  const selectedTime = watch('preferredTime')
  const consentChecked = watch('consent')

  const goToStep2 = async () => {
    const ok = await trigger(['serviceId'])
    if (ok) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const goToStep3 = async () => {
    const ok = await trigger(['patientName', 'phone', 'gender', 'preferredDate', 'preferredTime'])
    if (ok) { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const goToStep4 = async () => {
    const ok = await trigger(['lastHijama'])
    if (!ok) return
    const hasFlag = SCREENING_QUESTIONS.some(q => watch(q.id as keyof FormData) as boolean)
    setFlagged(hasFlag)
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const screeningAnswers = {
        ...Object.fromEntries(SCREENING_QUESTIONS.map(q => [q.id, data[q.id as keyof FormData] as boolean])),
        lastHijama: data.lastHijama || null,
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: parseInt(data.serviceId),
          serviceName: selectedService?.name ?? '',
          patientName: data.patientName,
          phone: data.phone,
          email: data.email || null,
          gender: data.gender,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          reason: data.reason || null,
          howHeard: howHeard || null,
          screeningAnswers,
          consentGiven: data.consent,
        }),
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      window.location.href = url
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.')
      setLoading(false)
    }
  }

  // ── Step labels ───────────────────────────────────────────────────────────
  const STEPS = ['Choose Service', 'Your Details', 'Health Check', 'Confirm & Book']

  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(26,74,74,0.10)', border: '1px solid #e6e2d8' }}>

      {/* ── Stepper ─────────────────────────────────────────────────────── */}

      {/* Mobile stepper — dark green bar */}
      <div className="md:hidden px-5 py-4" style={{ background: '#1a4a4a' }}>
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n
            return (
              <div key={label} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => done && setStep(n)}
                  disabled={!done}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-opacity"
                  style={{
                    background: done ? '#c9a84c' : active ? '#fff' : 'rgba(255,255,255,0.15)',
                    color: done ? '#fff' : active ? '#1a4a4a' : 'rgba(255,255,255,0.45)',
                    cursor: done ? 'pointer' : 'default',
                  }}
                  aria-label={done ? `Go back to ${label}` : label}
                >
                  {done ? '✓' : n}
                </button>
                {i < STEPS.length - 1 && (
                  <div className="w-5 h-px" style={{ background: step > n ? '#c9a84c' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-xs font-semibold mt-2.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </p>
      </div>

      {/* Desktop stepper — white bar */}
      <div className="hidden md:block px-8 py-5 border-b" style={{ background: '#fff', borderColor: '#f0ece4' }}>
        <div className="flex items-start justify-center gap-0">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n
            return (
              <div key={label} className="flex items-start">
                <div className="flex flex-col items-center" style={{ width: 80 }}>
                  <button
                    type="button"
                    onClick={() => done && setStep(n)}
                    disabled={!done}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: done ? '#1a4a4a' : active ? '#1a4a4a' : '#f0ece4',
                      color: done ? '#fff' : active ? '#fff' : '#a09890',
                      border: active ? '2px solid #c9a84c' : 'none',
                      cursor: done ? 'pointer' : 'default',
                    }}
                    aria-label={done ? `Go back to ${label}` : label}
                  >
                    {done ? '✓' : n}
                  </button>
                  <span
                    className="text-[10px] text-center mt-1.5 leading-tight"
                    style={{
                      color: active ? '#1a4a4a' : done ? '#4a5e58' : '#a09890',
                      fontWeight: active ? 700 : 400,
                      cursor: done ? 'pointer' : 'default',
                    }}
                    onClick={() => done && setStep(n)}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-px mt-[18px] flex-1"
                    style={{ width: 48, background: step > n ? '#c9a84c' : '#e6e2d8' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#faf7f2' }}>

        {/* ══ STEP 1: Choose a service ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>
                Choose Your Treatment
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Select the service you would like to book</p>
            </div>

            {/* Connected service list */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}>
              {services.map((s, idx) => {
                const selected = selectedServiceId === String(s.id)
                const isLast = idx === services.length - 1
                return (
                  <label
                    key={s.id}
                    className="flex items-start gap-4 px-4 py-4 cursor-pointer transition-colors"
                    style={{
                      background: selected ? '#1a4a4a' : '#fff',
                      borderBottom: isLast ? 'none' : '1px solid #ece8e0',
                    }}
                  >
                    <input
                      {...register('serviceId')}
                      type="radio"
                      value={String(s.id)}
                      className="sr-only"
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold leading-snug"
                        style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 17, color: selected ? '#fff' : '#1a2420' }}
                      >
                        {s.name}
                      </p>
                      {s.restrictions && (
                        <span
                          className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1"
                          style={{
                            background: selected ? 'rgba(201,168,76,0.2)' : '#fdf6e3',
                            color: selected ? '#d4b96a' : '#b8892a',
                            border: `1px solid ${selected ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.4)'}`,
                          }}
                        >
                          {s.restrictions}
                        </span>
                      )}
                      {s.description && (
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: selected ? 'rgba(255,255,255,0.65)' : '#7a8e88' }}>
                          {s.description}
                        </p>
                      )}
                    </div>

                    {/* Price + radio */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 700, color: selected ? '#c9a84c' : '#1a4a4a', lineHeight: 1 }}>
                        £{Number(s.price).toFixed(0)}
                      </p>
                      <p className="text-[11px]" style={{ color: selected ? 'rgba(255,255,255,0.5)' : '#a09890' }}>
                        {s.durationMinutes} min
                      </p>
                      {/* Radio indicator */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          border: selected ? '2px solid #c9a84c' : '2px solid #c0b9b0',
                          background: selected ? 'transparent' : 'transparent',
                        }}
                      >
                        {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#c9a84c' }} />}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            {errors.serviceId && (
              <p className="text-red-500 text-xs -mt-2">{errors.serviceId.message}</p>
            )}

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-5 flex-wrap">
              {['Sterile, single-use equipment', 'Female practitioners available', '5-star rated clinic'].map(text => (
                <div key={text} className="flex items-center gap-2 text-[11px]" style={{ color: '#8a9e98' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={goToStep2}
              className="w-full font-bold py-3.5 rounded-xl transition-colors text-sm"
              style={{ background: '#1a4a4a', color: '#fff' }}
            >
              Continue {selectedService ? `with ${selectedService.name}` : ''} →
            </button>
          </div>
        )}

        {/* ══ STEP 2: Your details ══════════════════════════════════════════ */}
        {step === 2 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>
                Your Details
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Just the basics — takes under a minute</p>
            </div>

            {/* Service summary bar */}
            {selectedService && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(26,74,74,0.06)', border: '1px solid rgba(26,74,74,0.12)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#c9a84c' }} />
                  <span className="text-sm font-semibold" style={{ color: '#1a4a4a' }}>{selectedService.name}</span>
                  <span className="text-xs" style={{ color: '#8a9e98' }}>· {selectedService.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm" style={{ color: '#1a4a4a' }}>£{Number(selectedService.price).toFixed(0)}</span>
                  <button type="button" onClick={() => setStep(1)} className="text-xs hover:underline" style={{ color: '#c9a84c' }}>Change</button>
                </div>
              </div>
            )}

            <SectionDivider label="Personal Info" />

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Full Name *</label>
              <input
                {...register('patientName')}
                placeholder="Your full name"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
              />
              {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Phone Number *</label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+44 7700 000000"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>
                  Email <span className="font-normal text-xs" style={{ color: '#a09890' }}>(for reminder)</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] -mt-2" style={{ color: '#a09890' }}>
              <Lock size={10} /> Your details are private and only used to manage your appointment
            </p>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Gender *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as const).map(g => {
                  const checked = watch('gender') === g
                  return (
                    <label
                      key={g}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-all text-sm font-semibold"
                      style={{
                        border: `1.5px solid ${checked ? '#1a4a4a' : '#d6d0c6'}`,
                        background: checked ? '#1a4a4a' : '#fff',
                        color: checked ? '#fff' : '#4a5e58',
                      }}
                    >
                      <input {...register('gender')} type="radio" value={g} className="sr-only" />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  )
                })}
              </div>
              {watch('gender') === 'female' && (
                <p className="text-xs mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: '#1a4a4a', background: 'rgba(26,74,74,0.06)', border: '1px solid rgba(26,74,74,0.12)' }}>
                  <CheckCircle2 size={12} className="shrink-0" />
                  A female practitioner will be assigned to your session.
                </p>
              )}
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            <SectionDivider label="Appointment" />

            {/* Date & Time — same row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Preferred Date *</label>
                <input
                  {...register('preferredDate')}
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
                />
                {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Preferred Time *</label>
                <ArrowTimePicker
                  value={selectedTime || ''}
                  onChange={v => setValue('preferredTime', v, { shouldValidate: true })}
                />
                {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>}
              </div>
            </div>

            <SectionDivider label="Additional Notes" />

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>
                What would you like to address? <span className="font-normal text-xs" style={{ color: '#a09890' }}>(optional)</span>
              </label>
              <textarea
                {...register('reason')}
                rows={3}
                placeholder="e.g. back pain, fatigue, general wellbeing, stress..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
              />
              <p className="text-[11px] mt-1" style={{ color: '#a09890' }}>
                This is shared only with your practitioner to help personalise your session.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goToStep3}
                className="font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                style={{ flex: 2, background: '#1a4a4a', color: '#fff' }}
              >
                Next: Quick Health Check →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Health screening ══════════════════════════════════════ */}
        {step === 3 && (
          <div className="p-5 md:p-7 space-y-5">
            {/* Info box */}
            <div className="px-4 py-4 rounded-xl" style={{ background: 'rgba(26,74,74,0.06)', borderLeft: '3px solid #1a4a4a' }}>
              <h2 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 22, color: '#1a2420' }}>
                A Quick Health Check
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>
                These 6 questions help us make sure hijama is right for you. <strong>Answering yes does not automatically disqualify you</strong> — we will simply reach out to discuss first.
              </p>
            </div>

            {/* Yes/No questions */}
            <div className="space-y-3">
              {SCREENING_QUESTIONS.map((q, i) => {
                const val = watch(q.id as keyof FormData) as boolean
                const flagged = val === true
                return (
                  <div
                    key={q.id}
                    className="rounded-xl px-4 py-3.5"
                    style={{
                      background: flagged ? '#fdf6e3' : '#fff',
                      border: `1.5px solid ${flagged ? '#e8b860' : '#d6d0c6'}`,
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                        style={{ background: flagged ? '#e8b860' : '#1a4a4a', color: '#fff' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#1a2420' }}>{q.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8a9e98' }}>{q.detail}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pl-9">
                      {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => {
                        const active = val === opt.value
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setValue(q.id as keyof FormData, opt.value as never)}
                            className="py-2 rounded-lg text-sm font-semibold transition-all"
                            style={{
                              border: `1.5px solid ${active ? (opt.value ? '#e8b860' : '#1a4a4a') : '#d6d0c6'}`,
                              background: active ? (opt.value ? '#fdf6e3' : 'rgba(26,74,74,0.08)') : '#fff',
                              color: active ? (opt.value ? '#b8892a' : '#1a4a4a') : '#8a9e98',
                            }}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-center italic" style={{ color: '#a09890' }}>
              If none of the above apply to you, select No for each and continue.
            </p>

            {/* Last hijama session */}
            <div className="rounded-xl px-4 py-4" style={{ background: '#fff', border: '1.5px solid #d6d0c6' }}>
              <label className="block text-sm font-semibold mb-3" style={{ color: '#1a2420' }}>
                When was your last hijama session?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LAST_HIJAMA_OPTIONS.map(opt => {
                  const checked = watch('lastHijama') === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setValue('lastHijama', opt)}
                      className="text-left px-3 py-2.5 rounded-lg text-sm transition-all"
                      style={{
                        border: `1.5px solid ${checked ? '#1a4a4a' : '#d6d0c6'}`,
                        background: checked ? 'rgba(26,74,74,0.08)' : '#fff',
                        color: checked ? '#1a4a4a' : '#4a5e58',
                        fontWeight: checked ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {errors.lastHijama && <p className="text-red-500 text-xs mt-2">{errors.lastHijama.message}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goToStep4}
                className="font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                style={{ flex: 2, background: '#1a4a4a', color: '#fff' }}
              >
                Next: Review &amp; Confirm →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 4: Confirm & Book ════════════════════════════════════════ */}
        {step === 4 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>
                Review &amp; Confirm
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Everything look right? Read the consent below and confirm.</p>
            </div>

            {/* Health flag banner */}
            {flagged && (
              <div className="rounded-xl p-4" style={{ background: '#fff9ed', border: '1.5px solid rgba(201,168,76,0.5)' }}>
                <div className="flex gap-3">
                  <AlertTriangle size={18} style={{ color: '#b8892a', flexShrink: 0, marginTop: 2 }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#b8892a' }}>We&apos;d like to speak with you first</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b5a3a' }}>
                      One or more answers suggest a quick chat before your appointment. You can still book — we will contact you to confirm suitability.
                    </p>
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent('As-salamu alaykum, I am booking an appointment and have a health question I would like to discuss first.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors text-white"
                        style={{ background: '#25D366' }}
                      >
                        <MessageCircle size={12} /> Chat with us on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Booking receipt */}
            {selectedService && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #d6d0c6' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: '#1a4a4a' }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a84c' }}>Booking Summary</p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs hover:underline" style={{ color: 'rgba(255,255,255,0.55)' }}>Edit</button>
                </div>
                <div style={{ background: '#fff' }}>
                  {[
                    ['Service', selectedService.name],
                    ['Name', watch('patientName')],
                    ['Date', watch('preferredDate')],
                    ['Time', watch('preferredTime')],
                    ['Duration', `${selectedService.durationMinutes} minutes`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5 text-sm" style={{ borderBottom: '1px solid #f0ece4' }}>
                      <span style={{ color: '#8a9e98' }}>{label}</span>
                      <span className="font-semibold" style={{ color: '#1a2420' }}>{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <span className="text-sm" style={{ color: '#8a9e98' }}>Deposit (due now)</span>
                    <span className="font-bold text-sm" style={{ color: '#b8892a' }}>£{DEPOSIT_AMOUNT}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <span className="text-sm" style={{ color: '#8a9e98' }}>Remaining balance</span>
                    <span className="font-semibold text-sm" style={{ color: '#4a5e58' }}>£{Math.max(0, Number(selectedService.price) - DEPOSIT_AMOUNT)} at clinic</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-sm font-semibold" style={{ color: '#4a5e58' }}>Total</span>
                    <p style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a4a4a', lineHeight: 1 }}>
                      £{Number(selectedService.price).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* How did you find us */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>
                How did you find us? <span className="font-normal text-xs" style={{ color: '#a09890' }}>(optional)</span>
              </label>
              <select
                value={howHeard}
                onChange={e => setHowHeard(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white"
                style={{ border: '1.5px solid #d6d0c6' }}
              >
                <option value="">— Select —</option>
                {['Google search', 'Instagram', 'Facebook', 'Friend / family referral', 'WhatsApp', 'Mosque / Islamic centre', 'Other'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Deposit notice */}
            <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: '#fdf6e3', border: '1.5px solid rgba(201,168,76,0.5)' }}>
              <CreditCard size={18} className="shrink-0 mt-0.5" style={{ color: '#b8892a' }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#b8892a' }}>£{DEPOSIT_AMOUNT} deposit required to confirm</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6b5a3a' }}>
                  Clicking the button below will take you to a secure Stripe payment page to pay your £{DEPOSIT_AMOUNT} deposit.
                  This secures your slot. The deposit is non-refundable if cancelled within 1–2 hours of your appointment.
                </p>
              </div>
            </div>

            {/* Consent */}
            <div>
              <p className="text-sm font-semibold mb-2.5" style={{ color: '#1a2420' }}>Treatment Consent</p>
              <div className="rounded-xl p-4 space-y-2.5 mb-3" style={{ background: '#fff', border: '1px solid #e6e2d8' }}>
                {CONSENT_POINTS.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color: '#4a5e58' }}>
                    <GoldCheck />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
              <label
                className="flex items-start gap-3 cursor-pointer px-4 py-3.5 rounded-xl transition-all"
                style={{
                  border: `1.5px solid ${consentChecked ? '#1a4a4a' : '#d6d0c6'}`,
                  background: consentChecked ? 'rgba(26,74,74,0.06)' : '#fff',
                }}
              >
                <input {...register('consent')} type="checkbox" className="mt-0.5 shrink-0 w-4 h-4 accent-[#1a4a4a]" />
                <span className="text-sm font-medium" style={{ color: '#1a2420' }}>
                  I have read and agree to the above — I consent to treatment.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="font-bold py-3.5 px-6 rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ flex: 2, background: '#c9a84c', color: '#fff' }}
              >
                <CreditCard size={15} />
                {loading ? 'Redirecting to payment…' : `Pay £${DEPOSIT_AMOUNT} Deposit`}
              </button>
            </div>

            <p className="text-center text-xs flex items-center justify-center gap-1" style={{ color: '#a09890' }}>
              <Lock size={10} /> Your information is secure and never shared with third parties
            </p>
          </div>
        )}

      </form>
    </div>
  )
}
