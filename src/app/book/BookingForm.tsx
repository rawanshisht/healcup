'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Clock, CheckCircle2, AlertTriangle, MessageCircle, Star, Lock, Users } from 'lucide-react'
import type { Service } from '@/lib/schema'

// ── Time slots grouped by period ─────────────────────────────────────────────
const TIME_GROUPS = [
  { label: 'Morning',   icon: '🌅', slots: ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM'] },
  { label: 'Afternoon', icon: '☀️', slots: ['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'] },
  { label: 'Evening',   icon: '🌙', slots: ['4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM'] },
]

const SCREENING_QUESTIONS = [
  { id: 'blood_thinners', label: 'Blood thinners or anticoagulant medication',  detail: 'e.g. warfarin, rivaroxaban, daily aspirin' },
  { id: 'skin_infection', label: 'Active skin infection or open wound',          detail: 'at or near the intended treatment area' },
  { id: 'fever',          label: 'Fever, flu, or acute illness',                detail: 'currently unwell on the day of booking' },
  { id: 'pregnant',       label: 'Pregnancy',                                   detail: 'currently pregnant or trying to conceive' },
  { id: 'anaemia',        label: 'Severe anaemia or blood/clotting disorder',   detail: 'diagnosed condition affecting blood' },
  { id: 'recent_surgery', label: 'Surgery within the last 4 weeks',             detail: 'any surgical procedure in the past month' },
]

const schema = z.object({
  serviceId:      z.string().min(1, 'Please choose a service above'),
  patientName:    z.string().min(2, 'Please enter your full name'),
  phone:          z.string().min(7, 'Please enter a valid phone number'),
  email:          z.string().email('Please enter a valid email').or(z.literal('')),
  gender:         z.enum(['male', 'female'], 'Please select your gender'),
  preferredDate:  z.string().min(1, 'Please select a preferred date'),
  preferredTime:  z.string().min(1, 'Please select a preferred time'),
  reason:         z.string().optional(),
  howHeard:       z.string().optional(),
  blood_thinners: z.boolean(),
  skin_infection: z.boolean(),
  fever:          z.boolean(),
  pregnant:       z.boolean(),
  anaemia:        z.boolean(),
  recent_surgery: z.boolean(),
  consent:        z.boolean().refine(v => v === true, 'Please agree to the consent form to continue'),
})

type FormData = z.infer<typeof schema>

const CONSENT_POINTS = [
  'Hijama is a complementary therapy — not a substitute for medical diagnosis or treatment.',
  'I confirm the information I have provided is accurate and complete.',
  'I understand that temporary bruising and skin marks are a normal part of treatment.',
  'I consent to treatment and understand the practitioner may pause or stop if needed for my safety.',
  'I have read the pre-appointment and aftercare instructions.',
]

export default function BookingForm({ services }: { services: Service[] }) {
  const searchParams   = useSearchParams()
  const defaultService = searchParams.get('service') ?? ''
  const waNumber       = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const clinicPhone    = process.env.NEXT_PUBLIC_CLINIC_PHONE    ?? ''

  const [step,      setStep]      = useState(1)
  const [timePeriod,setTimePeriod]= useState<string | null>(null)
  const [flagged,   setFlagged]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [howHeard,  setHowHeard]  = useState('')   // captured post-submit

  const {
    register, handleSubmit, watch, trigger, setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultService,
      email: '',
      blood_thinners: false, skin_infection: false,
      fever: false, pregnant: false, anaemia: false, recent_surgery: false,
      consent: false,
    },
  })

  const selectedServiceId = watch('serviceId')
  const selectedService   = services.find(s => String(s.id) === selectedServiceId)
  const selectedTime      = watch('preferredTime')

  // Step 1 → 2: validate service selection only
  const goToStep2 = async () => {
    const ok = await trigger(['serviceId'])
    if (ok) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  // Step 2 → 3: validate all personal details
  const goToStep3 = async () => {
    const ok = await trigger(['patientName','phone','gender','preferredDate','preferredTime'])
    if (ok) { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  // Step 3 → 4: check screening flags
  const goToStep4 = () => {
    const hasFlag = SCREENING_QUESTIONS.some(q => watch(q.id as keyof FormData) as boolean)
    setFlagged(hasFlag)
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const screeningAnswers = Object.fromEntries(
        SCREENING_QUESTIONS.map(q => [q.id, data[q.id as keyof FormData] as boolean])
      )
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId:       parseInt(data.serviceId),
          serviceName:     selectedService?.name ?? '',
          patientName:     data.patientName,
          phone:           data.phone,
          email:           data.email || null,
          gender:          data.gender,
          preferredDate:   data.preferredDate,
          preferredTime:   data.preferredTime,
          reason:          data.reason || null,
          howHeard:        howHeard || null,
          screeningAnswers,
          consentGiven:    data.consent,
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (submitted) {
    const waConfirmUrl = waNumber
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`As-salamu alaykum, I just booked an appointment for ${selectedService?.name ?? 'hijama'} on ${watch('preferredDate')} at ${watch('preferredTime')}. My name is ${watch('patientName')}. Looking forward to your confirmation.`)}`
      : null

    return (
      <div className="bg-white rounded-2xl border border-[#e0d9cf] shadow-sm overflow-hidden">
        {/* Green top bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#237070] via-[#2a8a8a] to-[#237070]" />

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-[#237070]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1a4a4a] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Appointment Provisionally Held
          </h2>
          <p className="text-[#237070] font-semibold text-sm mb-4">JazakAllahu Khayran — your spot is provisionally held</p>

          {/* Booking summary */}
          <div className="bg-[#f0f9f9] border border-[#e0d9cf] rounded-xl p-4 text-left max-w-sm mx-auto mb-5">
            <p className="text-xs font-bold text-[#1a4a4a] uppercase tracking-wider mb-3">Your Booking</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-semibold text-[#1a4a4a]">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-[#1a4a4a]">{watch('preferredDate')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-semibold text-[#1a4a4a]">{watch('preferredTime')}</span>
              </div>
              <div className="flex justify-between border-t border-[#e0d9cf] pt-2 mt-2">
                <span className="text-gray-500">Price</span>
                <span className="font-bold text-[#1e5c5c]">£{Number(selectedService?.price ?? 0).toFixed(0)} — pay at clinic</span>
              </div>
            </div>
          </div>

          {/* Confirmation guarantee */}
          <div className="bg-[#1a4a4a] text-white rounded-xl p-4 max-w-sm mx-auto mb-5 text-sm text-left">
            <p className="font-semibold mb-1">What happens next?</p>
            <ul className="space-y-1.5 text-white/80 text-xs">
              <li>✓ We will send a WhatsApp to lock in your appointment during clinic hours (Mon–Sat, 9am–6pm)</li>
              <li>✓ Booked outside clinic hours? We will be in touch the next working morning</li>
              <li>✓ A reminder will be sent 24 hours before your appointment</li>
              {clinicPhone && <li>✓ Questions in the meantime? Call us on {clinicPhone}</li>}
            </ul>
          </div>

          {/* WhatsApp follow-up CTA */}
          {waConfirmUrl && (
            <a
              href={waConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors mb-5"
            >
              <MessageCircle size={16} />
              Send us a WhatsApp to confirm faster
            </a>
          )}

          {/* Pre-care reminder */}
          <div className="bg-[#fdf6e3] border border-[#c9a84c]/30 rounded-xl p-4 text-left max-w-sm mx-auto mb-5">
            <p className="font-semibold text-[#b8892a] text-sm mb-2">Before your appointment</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Eat a light meal 2–3 hours before</li>
              <li>• Shower and wear loose, dark-coloured clothing</li>
              <li>• Stay well hydrated throughout the day</li>
              <li>• Avoid strenuous exercise 24 hours before</li>
            </ul>
          </div>

          {/* Post-commitment: how did you hear about us */}
          <div className="max-w-sm mx-auto text-left">
            <p className="text-xs text-gray-400 mb-1.5">One last thing — how did you find us? <span className="text-gray-300">(optional)</span></p>
            <select
              value={howHeard}
              onChange={e => setHowHeard(e.target.value)}
              className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <option value="">— Select —</option>
              {['Google search','Instagram','Facebook','Friend / family referral','WhatsApp','Mosque / Islamic centre','Other'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">This helps us know where to focus our efforts — thank you.</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Step indicator ────────────────────────────────────────────────────────
  const STEPS = ['Choose Service', 'Your Details', 'Health Check', 'Confirm & Book']

  return (
    <div className="bg-white rounded-2xl border border-[#e0d9cf] shadow-sm overflow-hidden">

      {/* Progress bar */}
      <div className="bg-[#f0f9f9] border-b border-[#e0d9cf] px-6 py-4">
        <div className="flex items-center justify-center gap-1">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done   = step > n
            const active = step === n
            return (
              <div key={label} className="flex items-center gap-1">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${done ? 'bg-[#237070] text-white' : active ? 'bg-[#1a4a4a] text-white' : 'bg-[#e6f4f4] text-[#6b9b9b]'}`}>
                    {done ? '✓' : n}
                  </div>
                  <span className={`text-[10px] mt-0.5 hidden sm:block transition-colors
                    ${active ? 'text-[#1a4a4a] font-semibold' : done ? 'text-[#237070]' : 'text-gray-300'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 sm:w-10 h-px mb-3 transition-colors ${step > n ? 'bg-[#237070]' : 'bg-[#e0d9cf]'}`} />
                )}
              </div>
            )
          })}
        </div>
        {/* Mobile: show current step label */}
        <p className="sm:hidden text-center text-xs font-semibold text-[#1a4a4a] mt-2">
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">

        {/* ══ STEP 1: Choose a service ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
                Choose Your Treatment
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Select the service you would like to book</p>
            </div>

            {/* Service cards */}
            <div className="space-y-3">
              {services.map(s => {
                const selected = selectedServiceId === String(s.id)
                return (
                  <label
                    key={s.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selected
                        ? 'border-[#1a4a4a] bg-[#f0f9f9] shadow-sm'
                        : 'border-[#e0d9cf] bg-white hover:border-[#2a8a8a] hover:bg-[#f8fdfd]'
                      }`}
                  >
                    <input
                      {...register('serviceId')}
                      type="radio"
                      value={String(s.id)}
                      className="sr-only"
                    />
                    {/* Selector circle */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors
                      ${selected ? 'border-[#1a4a4a] bg-[#1a4a4a]' : 'border-[#c0b9b0]'}`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#1a4a4a] text-sm" style={{ fontFamily: 'Georgia, serif' }}>{s.name}</p>
                          {s.restrictions && (
                            <span className="inline-block text-[10px] bg-[#fdf6e3] text-[#b8892a] border border-[#c9a84c]/40 px-2 py-0.5 rounded-full mt-0.5">
                              {s.restrictions}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-[#1e5c5c]">£{Number(s.price).toFixed(0)}</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-0.5 justify-end">
                            <Clock size={9} /> {s.durationMinutes} min
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{s.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            {errors.serviceId && (
              <p className="text-red-500 text-xs -mt-2">{errors.serviceId.message}</p>
            )}

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 pt-1 flex-wrap">
              {[
                { icon: Lock,  text: 'Sterile, single-use equipment' },
                { icon: Users, text: 'Female practitioners available' },
                { icon: Star,  text: '5-star rated clinic' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Icon size={11} className="text-[#237070]" />
                  {text}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={async () => {
                const ok = await trigger(['serviceId'])
                if (ok) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }
              }}
              className="w-full bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Continue with {selectedService ? selectedService.name : 'Selected Service'} →
            </button>
          </div>
        )}

        {/* ══ STEP 2: Your details ══════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Your Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Just the basics — takes under a minute</p>
            </div>

            {/* Selected service reminder */}
            {selectedService && (
              <div className="flex items-center justify-between bg-[#f0f9f9] border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm">
                <div>
                  <span className="font-semibold text-[#1a4a4a]">{selectedService.name}</span>
                  <span className="text-gray-400 text-xs ml-2">· {selectedService.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#1e5c5c]">£{Number(selectedService.price).toFixed(0)}</span>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#237070] hover:underline">Change</button>
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Full Name *</label>
              <input
                {...register('patientName')}
                placeholder="e.g. Fatima Al-Hassan"
                className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
              />
              {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Phone Number *</label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+44 7700 000000"
                  className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">
                  Email <span className="text-gray-400 font-normal text-xs">(for reminder)</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400 -mt-2">
              <Lock size={10} /> Your details are private and only used to manage your appointment
            </p>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Gender *</label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map(g => {
                  const checked = watch('gender') === g
                  return (
                    <label
                      key={g}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium
                        ${checked ? 'border-[#1a4a4a] bg-[#f0f9f9] text-[#1a4a4a]' : 'border-[#e0d9cf] text-gray-600 hover:border-[#2a8a8a]'}`}
                    >
                      <input {...register('gender')} type="radio" value={g} className="sr-only" />
                      {g === 'female' ? '👩' : '👨'} {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  )
                })}
              </div>
              {/* Female practitioner note */}
              {watch('gender') === 'female' && (
                <p className="text-xs text-[#237070] mt-2 flex items-center gap-1.5 bg-[#f0f9f9] px-3 py-2 rounded-lg border border-[#e0d9cf]">
                  <CheckCircle2 size={12} className="shrink-0" />
                  A female practitioner will be assigned to your session — please mention any preference in the notes below.
                </p>
              )}
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Preferred Date *</label>
              <input
                {...register('preferredDate')}
                type="date"
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
              />
              <p className="text-xs text-[#b8892a] mt-1.5 flex items-center gap-1">
                ✦ The 17th, 19th &amp; 21st of the Islamic lunar month are Sunnah days — recommended by the Prophet ﷺ
              </p>
              {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
            </div>

            {/* Time — grouped slots */}
            <div>
              <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Preferred Time *</label>
              {/* Period selector */}
              <div className="flex gap-2 mb-3">
                {TIME_GROUPS.map(g => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => { setTimePeriod(g.label); setValue('preferredTime', '') }}
                    className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border-2 text-xs font-semibold transition-all
                      ${timePeriod === g.label
                        ? 'border-[#1a4a4a] bg-[#f0f9f9] text-[#1a4a4a]'
                        : 'border-[#e0d9cf] text-gray-500 hover:border-[#2a8a8a]'
                      }`}
                  >
                    <span className="text-base mb-0.5">{g.icon}</span>
                    {g.label}
                  </button>
                ))}
              </div>
              {/* Slot grid */}
              {timePeriod && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_GROUPS.find(g => g.label === timePeriod)?.slots.map(slot => {
                    const active = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setValue('preferredTime', slot, { shouldValidate: true })}
                        className={`py-2 rounded-lg border text-xs font-medium transition-all
                          ${active
                            ? 'border-[#1a4a4a] bg-[#1a4a4a] text-white'
                            : 'border-[#e0d9cf] text-gray-600 hover:border-[#2a8a8a] hover:bg-[#f0f9f9]'
                          }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              )}
              {!timePeriod && (
                <p className="text-xs text-gray-400 text-center py-3 bg-[#fafafa] rounded-xl border border-dashed border-[#e0d9cf]">
                  Select a period above to choose a time slot
                </p>
              )}
              {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime.message}</p>}
            </div>

            {/* Reason — reframed */}
            <div>
              <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">
                What would you like to address? <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <textarea
                {...register('reason')}
                rows={2}
                placeholder="e.g. back pain, fatigue, general wellbeing, stress..."
                className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-[#e0d9cf] text-[#1a4a4a] font-semibold py-3 rounded-xl hover:bg-[#f0f9f9] transition-colors text-sm">
                ← Back
              </button>
              <button type="button" onClick={goToStep3} className="flex-2 flex-grow bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
                Next: Quick Health Check →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Health screening ══════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Warm intro — no clinical cold-open */}
            <div className="bg-[#f0f9f9] border border-[#e0d9cf] rounded-xl p-4">
              <h2 className="text-lg font-bold text-[#1a4a4a] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                A Quick Health Check
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We care about your safety above all else. These 6 yes/no questions take 30 seconds and help us make sure hijama is right for you.{' '}
                <strong>Answering yes does not automatically disqualify you</strong> — we will simply reach out to discuss first.
              </p>
            </div>

            <div className="space-y-2.5">
              {SCREENING_QUESTIONS.map((q, i) => {
                const checked = watch(q.id as keyof FormData) as boolean
                return (
                  <label
                    key={q.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all
                      ${checked
                        ? 'border-[#c9a84c] bg-[#fdf6e3]'
                        : 'border-[#e0d9cf] bg-white hover:border-[#2a8a8a] hover:bg-[#f8fdfd]'
                      }`}
                  >
                    <input
                      {...register(q.id as keyof FormData)}
                      type="checkbox"
                      className="mt-0.5 accent-[#1a4a4a] shrink-0 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{i + 1}. {q.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{q.detail}</p>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* None of the above reassurance */}
            <p className="text-xs text-gray-400 text-center italic">
              If none of the above apply to you, simply leave them all unchecked and continue.
            </p>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border-2 border-[#e0d9cf] text-[#1a4a4a] font-semibold py-3 rounded-xl hover:bg-[#f0f9f9] transition-colors text-sm">
                ← Back
              </button>
              <button type="button" onClick={goToStep4} className="flex-2 flex-grow bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
                Next: Review &amp; Confirm →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 4: Confirm & Book ════════════════════════════════════════ */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Review &amp; Confirm</h2>
              <p className="text-sm text-gray-500 mt-0.5">Everything look right? Read the consent below and confirm.</p>
            </div>

            {/* ── Screening flag — with WhatsApp CTA ── */}
            {flagged && (
              <div className="bg-[#fff9ed] border border-[#c9a84c]/50 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle size={18} className="text-[#b8892a] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#b8892a]">We&apos;d like to speak with you first</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      One or more of your health screening answers suggests it&apos;s worth a quick chat before your appointment to make sure hijama is right for you. You can still book — we will contact you to confirm suitability.
                    </p>
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent('As-salamu alaykum, I am booking an appointment and have a health question I would like to discuss first.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold bg-[#25D366] text-white px-3 py-1.5 rounded-lg hover:bg-[#1ebe5d] transition-colors"
                      >
                        <MessageCircle size={12} /> Chat with us on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Booking summary — BEFORE consent ── */}
            {selectedService && (
              <div className="bg-[#f0f9f9] border border-[#e0d9cf] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e0d9cf] flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1a4a4a] uppercase tracking-wider">Booking Summary</p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[#237070] hover:underline">Edit</button>
                </div>
                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-semibold text-[#1a4a4a]">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-semibold text-[#1a4a4a]">{watch('patientName')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date &amp; Time</span>
                    <span className="font-semibold text-[#1a4a4a]">{watch('preferredDate')} · {watch('preferredTime')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-700">{selectedService.durationMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between border-t border-[#e0d9cf] pt-2 mt-1">
                    <span className="font-semibold text-gray-700">Total</span>
                    <div className="text-right">
                      <span className="font-bold text-[#1e5c5c] text-base">£{Number(selectedService.price).toFixed(0)}</span>
                      <p className="text-xs text-gray-400">Cash or card at clinic</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Consent — bullet points, not a legal wall ── */}
            <div>
              <p className="text-sm font-semibold text-[#1a4a4a] mb-2">Treatment Consent</p>
              <div className="bg-[#fafafa] border border-[#e0d9cf] rounded-xl p-4 space-y-2 mb-3">
                {CONSENT_POINTS.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={13} className="text-[#237070] shrink-0 mt-0.5" />
                    {point}
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 border-[#e0d9cf] hover:border-[#1a4a4a] hover:bg-[#f0f9f9] transition-all">
                <input {...register('consent')} type="checkbox" className="mt-0.5 accent-[#1a4a4a] shrink-0 w-4 h-4" />
                <span className="text-sm text-gray-700 font-medium">
                  I have read and agree to the above — I consent to treatment.
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent.message}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(3)} className="flex-1 border-2 border-[#e0d9cf] text-[#1a4a4a] font-semibold py-3 rounded-xl hover:bg-[#f0f9f9] transition-colors text-sm">
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 flex-grow bg-[#c9a84c] hover:bg-[#b8892a] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Confirming...' : '✓ Confirm My Appointment'}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <Lock size={10} /> Your information is secure and never shared with third parties
            </p>
          </div>
        )}

      </form>
    </div>
  )
}
