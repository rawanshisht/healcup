'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle2, AlertTriangle, MessageCircle, Lock,
  ChevronLeft, ChevronRight, CreditCard, Users, User,
} from 'lucide-react'
import type { Service } from '@/lib/schema'

// ─── Types ───────────────────────────────────────────────────────────────────

type PatientData = {
  name: string
  phone: string
  email: string
  gender: '' | 'male' | 'female'
  reason: string
  blood_thinners:      boolean | null
  high_blood_pressure: boolean | null
  skin_infection:      boolean | null
  fever:               boolean | null
  pregnant:            boolean | null
  anaemia:             boolean | null
  recent_surgery:      boolean | null
  lastHijama: string
}

type SlotInfo = { booked: number; available: number; blocked: boolean; capacity: number }

// ─── Constants ───────────────────────────────────────────────────────────────

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

const CONSENT_POINTS = [
  'Hijama is a complementary therapy — not a substitute for medical diagnosis or treatment.',
  'I confirm the information provided for all patients is accurate and complete.',
  'I understand that temporary bruising and skin marks are a normal part of treatment.',
  'I consent to treatment for all listed patients and understand the practitioner may pause or stop if needed for safety.',
  'I have read the pre-appointment and aftercare instructions.',
  'The £20 deposit is non-refundable if cancelled within 1–2 hours of the scheduled appointment time.',
]

const DEPOSIT_PER_PERSON = 20

const D_HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const D_MINS  = ['00', '30']
const D_AMPM  = ['AM', 'PM']

const emptyPatient = (): PatientData => ({
  name: '', phone: '', email: '', gender: '', reason: '',
  blood_thinners: false, high_blood_pressure: false, skin_infection: false,
  fever: false, pregnant: false, anaemia: false, recent_surgery: false,
  lastHijama: '',
})

// ─── Sub-components ──────────────────────────────────────────────────────────

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

  const cycle = (items: string[], cur: string, dir: 1 | -1) =>
    items[(items.indexOf(cur) + dir + items.length) % items.length]

  const btn = 'p-1 rounded hover:bg-[#e6f4f4] text-[#4a5e58] hover:text-[#1a4a4a] transition-colors flex items-center justify-center'

  return (
    <div className="flex items-center w-full rounded-xl px-3 py-3 text-sm" style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}>
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

function SlotBadge({ slotInfo, groupSize, loading }: { slotInfo: SlotInfo | null; groupSize: number; loading: boolean }) {
  if (loading) return <span className="text-xs text-gray-400 animate-pulse">Checking availability…</span>
  if (!slotInfo) return null

  if (slotInfo.blocked || slotInfo.available === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
        Fully booked — choose another time
      </span>
    )
  }
  if (groupSize > slotInfo.available) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fdf6e3', color: '#b8892a', border: '1px solid #e8b860' }}>
        Only {slotInfo.available} spot{slotInfo.available > 1 ? 's' : ''} left — reduce group size
      </span>
    )
  }
  if (slotInfo.available < 3) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fdf6e3', color: '#b8892a', border: '1px solid #e8b860' }}>
        {slotInfo.available} spot{slotInfo.available > 1 ? 's' : ''} remaining
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>
      Available
    </span>
  )
}

// ─── Patient form (used once per person in Step 3) ────────────────────────────

function PatientForm({
  patient, index, errors, onChange,
}: {
  patient: PatientData
  index: number
  errors: string[]
  onChange: (field: keyof PatientData, value: PatientData[keyof PatientData]) => void
}) {
  const hasFlaggedQuestion = SCREENING_QUESTIONS.some(q => patient[q.id as keyof PatientData] === true)

  return (
    <div className="space-y-5">
      {errors.length > 0 && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c' }}>
          {errors.map((e, i) => <p key={i}>· {e}</p>)}
        </div>
      )}

      <SectionDivider label="Personal Info" />

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Full Name *</label>
        <input
          value={patient.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Full name"
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
          style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
        />
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Phone Number *</label>
          <input
            value={patient.phone}
            onChange={e => onChange('phone', e.target.value)}
            type="tel"
            placeholder="+44 7700 000000"
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>
            Email <span className="font-normal text-xs" style={{ color: '#a09890' }}>(optional)</span>
          </label>
          <input
            value={patient.email}
            onChange={e => onChange('email', e.target.value)}
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
            style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
          />
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] -mt-2" style={{ color: '#a09890' }}>
        <Lock size={10} /> Details are private and only used to manage appointments
      </p>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Gender *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map(g => {
            const checked = patient.gender === g
            return (
              <button
                key={g}
                type="button"
                onClick={() => onChange('gender', g)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-semibold"
                style={{
                  border: `1.5px solid ${checked ? '#1a4a4a' : '#d6d0c6'}`,
                  background: checked ? '#1a4a4a' : '#fff',
                  color: checked ? '#fff' : '#4a5e58',
                }}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            )
          })}
        </div>
        {patient.gender === 'female' && (
          <p className="text-xs mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ color: '#1a4a4a', background: 'rgba(26,74,74,0.06)', border: '1px solid rgba(26,74,74,0.12)' }}>
            <CheckCircle2 size={12} className="shrink-0" />
            A female practitioner will be assigned.
          </p>
        )}
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>
          What would they like to address? <span className="font-normal text-xs" style={{ color: '#a09890' }}>(optional)</span>
        </label>
        <textarea
          value={patient.reason}
          onChange={e => onChange('reason', e.target.value)}
          rows={2}
          placeholder="e.g. back pain, fatigue, general wellbeing…"
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
        />
      </div>

      <SectionDivider label="Health History" />

      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(26,74,74,0.06)', borderLeft: '3px solid #1a4a4a' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>
          <strong>Answering yes does not automatically disqualify.</strong> We will simply reach out to discuss first.
        </p>
      </div>

      {/* Yes/No screening questions */}
      <div className="space-y-3">
        {SCREENING_QUESTIONS.map((q, i) => {
          const val = patient[q.id as keyof PatientData] as boolean | null
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
                      onClick={() => onChange(q.id as keyof PatientData, opt.value as never)}
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

      {/* Last hijama */}
      <div className="rounded-xl px-4 py-4" style={{ background: '#fff', border: '1.5px solid #d6d0c6' }}>
        <label className="block text-sm font-semibold mb-3" style={{ color: '#1a2420' }}>
          When was their last hijama session? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LAST_HIJAMA_OPTIONS.map(opt => {
            const checked = patient.lastHijama === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('lastHijama', opt)}
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
      </div>

      {hasFlaggedQuestion && (
        <div className="rounded-xl p-4" style={{ background: '#fff9ed', border: '1.5px solid rgba(201,168,76,0.5)' }}>
          <div className="flex gap-3">
            <AlertTriangle size={16} style={{ color: '#b8892a', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: '#6b5a3a' }}>
              One or more answers may need a quick discussion. You can still book — we will contact you to confirm suitability.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams()
  const defaultService = searchParams.get('service') ?? ''
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  // Step state
  const [step, setStep] = useState(1)

  // Step 1
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService)
  const [step1Error, setStep1Error] = useState('')

  // Step 2
  const [apptDate, setApptDate] = useState('')
  const [apptTime, setApptTime] = useState('9:00 AM')
  const [groupSize, setGroupSize] = useState<1 | 2 | 3>(1)
  const [slotInfo, setSlotInfo] = useState<SlotInfo | null>(null)
  const [slotLoading, setSlotLoading] = useState(false)
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({})

  // Step 3
  const [patients, setPatients] = useState<PatientData[]>([emptyPatient()])
  const [activeTab, setActiveTab] = useState(0)
  const [step3Errors, setStep3Errors] = useState<Record<number, string[]>>({})

  // Step 4
  const [howHeard, setHowHeard] = useState('')
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedService = services.find(s => String(s.id) === selectedServiceId)

  // Sync patients array to groupSize
  useEffect(() => {
    setPatients(prev => {
      const next = [...prev]
      while (next.length < groupSize) next.push(emptyPatient())
      return next.slice(0, groupSize)
    })
    setActiveTab(0)
  }, [groupSize])

  // Fetch slot info whenever date+time change
  useEffect(() => {
    if (!apptDate || !apptTime) { setSlotInfo(null); return }
    setSlotLoading(true)
    fetch(`/api/slots?date=${apptDate}&time=${encodeURIComponent(apptTime)}`)
      .then(r => r.json())
      .then(data => { setSlotInfo(data); setSlotLoading(false) })
      .catch(() => setSlotLoading(false))
  }, [apptDate, apptTime])

  const updatePatient = useCallback((idx: number, field: keyof PatientData, value: PatientData[keyof PatientData]) => {
    setPatients(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }, [])

  // ── Step navigation ──────────────────────────────────────────────────────

  const goToStep2 = () => {
    if (!selectedServiceId) { setStep1Error('Please choose a service above'); return }
    setStep1Error('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToStep3 = () => {
    const errs: Record<string, string> = {}
    if (!apptDate) errs.date = 'Please select a preferred date'
    if (!apptTime) errs.time = 'Please select a preferred time'
    if (slotInfo) {
      if (slotInfo.blocked || slotInfo.available === 0) {
        errs.slot = 'This time slot is fully booked. Please choose a different time.'
      } else if (groupSize > slotInfo.available) {
        errs.slot = `Only ${slotInfo.available} spot${slotInfo.available > 1 ? 's' : ''} remaining. Reduce the number of people or choose a different time.`
      }
    }
    setStep2Errors(errs)
    if (Object.keys(errs).length > 0) return
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validatePatient = (p: PatientData): string[] => {
    const errs: string[] = []
    if (p.name.trim().length < 2) errs.push('Full name is required (min 2 characters)')
    if (p.phone.trim().length < 7) errs.push('Phone number is required')
    if (!p.gender) errs.push('Please select a gender')
    const unanswered = SCREENING_QUESTIONS.some(q => p[q.id as keyof PatientData] === null)
    if (unanswered) errs.push('Please answer all health questions')
    if (!p.lastHijama) errs.push('Please select when they last had hijama')
    return errs
  }

  const goToStep4 = () => {
    const allErrors: Record<number, string[]> = {}
    patients.forEach((p, i) => {
      const errs = validatePatient(p)
      if (errs.length > 0) allErrors[i] = errs
    })
    setStep3Errors(allErrors)
    if (Object.keys(allErrors).length > 0) {
      // Switch to first tab with errors
      const firstErrorTab = Object.keys(allErrors).map(Number).sort()[0]
      setActiveTab(firstErrorTab)
      return
    }
    setStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async () => {
    if (!consent) { setConsentError('Please agree to the consent form to continue'); return }
    setConsentError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId:     parseInt(selectedServiceId),
          serviceName:   selectedService?.name ?? '',
          preferredDate: apptDate,
          preferredTime: apptTime,
          howHeard:      howHeard || null,
          consentGiven:  consent,
          patients: patients.map(p => ({
            name:   p.name,
            phone:  p.phone,
            email:  p.email || null,
            gender: p.gender,
            reason: p.reason || null,
            screeningAnswers: {
              blood_thinners:      p.blood_thinners,
              high_blood_pressure: p.high_blood_pressure,
              skin_infection:      p.skin_infection,
              fever:               p.fever,
              pregnant:            p.pregnant,
              anaemia:             p.anaemia,
              recent_surgery:      p.recent_surgery,
              lastHijama:          p.lastHijama,
            },
          })),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      window.location.href = json.url
    } catch {
      toast.error('Something went wrong. Please try again or call us directly.')
      setLoading(false)
    }
  }

  // ── Stepper labels ───────────────────────────────────────────────────────

  const STEPS = ['Choose Service', 'Appointment', 'Patient Info', 'Confirm & Book']

  const depositTotal = DEPOSIT_PER_PERSON

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(26,74,74,0.10)', border: '1px solid #e6e2d8' }}>

      {/* ── Stepper mobile ──────────────────────────────────────────────── */}
      <div className="md:hidden px-5 py-4" style={{ background: '#1a4a4a' }}>
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = step > n; const active = step === n
            return (
              <div key={label} className="flex items-center gap-2">
                <button type="button" onClick={() => done && setStep(n)} disabled={!done}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-opacity"
                  style={{ background: done ? '#c9a84c' : active ? '#fff' : 'rgba(255,255,255,0.15)', color: done ? '#fff' : active ? '#1a4a4a' : 'rgba(255,255,255,0.45)', cursor: done ? 'pointer' : 'default' }}>
                  {done ? '✓' : n}
                </button>
                {i < STEPS.length - 1 && <div className="w-5 h-px" style={{ background: step > n ? '#c9a84c' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            )
          })}
        </div>
        <p className="text-center text-xs font-semibold mt-2.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </p>
      </div>

      {/* ── Stepper desktop ─────────────────────────────────────────────── */}
      <div className="hidden md:block px-8 py-5 border-b" style={{ background: '#fff', borderColor: '#f0ece4' }}>
        <div className="flex items-start justify-center gap-0">
          {STEPS.map((label, i) => {
            const n = i + 1; const done = step > n; const active = step === n
            return (
              <div key={label} className="flex items-start">
                <div className="flex flex-col items-center" style={{ width: 80 }}>
                  <button type="button" onClick={() => done && setStep(n)} disabled={!done}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{ background: done ? '#1a4a4a' : active ? '#1a4a4a' : '#f0ece4', color: done ? '#fff' : active ? '#fff' : '#a09890', border: active ? '2px solid #c9a84c' : 'none', cursor: done ? 'pointer' : 'default' }}>
                    {done ? '✓' : n}
                  </button>
                  <span className="text-[10px] text-center mt-1.5 leading-tight" style={{ color: active ? '#1a4a4a' : done ? '#4a5e58' : '#a09890', fontWeight: active ? 700 : 400, cursor: done ? 'pointer' : 'default' }}
                    onClick={() => done && setStep(n)}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div className="h-px mt-[18px]" style={{ width: 48, background: step > n ? '#c9a84c' : '#e6e2d8' }} />}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#faf7f2' }}>

        {/* ══ STEP 1: Choose a service ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>Choose Your Treatment</h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Select the service you would like to book</p>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}>
              {services.map((s, idx) => {
                const selected = selectedServiceId === String(s.id)
                return (
                  <label key={s.id} className="flex items-start gap-4 px-4 py-4 cursor-pointer transition-colors"
                    style={{ background: selected ? '#1a4a4a' : '#fff', borderBottom: idx < services.length - 1 ? '1px solid #ece8e0' : 'none' }}>
                    <input type="radio" value={String(s.id)} checked={selected} onChange={() => setSelectedServiceId(String(s.id))} className="sr-only" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold leading-snug" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 17, color: selected ? '#fff' : '#1a2420' }}>
                        {s.name}
                      </p>
                      {s.restrictions && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1" style={{ background: selected ? 'rgba(201,168,76,0.2)' : '#fdf6e3', color: selected ? '#d4b96a' : '#b8892a', border: '1px solid rgba(201,168,76,0.4)' }}>
                          {s.restrictions}
                        </span>
                      )}
                      {s.description && (
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: selected ? 'rgba(255,255,255,0.65)' : '#7a8e88' }}>{s.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 700, color: selected ? '#c9a84c' : '#1a4a4a', lineHeight: 1 }}>
                        £{Number(s.price).toFixed(0)}
                      </p>
                      <p className="text-[11px]" style={{ color: selected ? 'rgba(255,255,255,0.5)' : '#a09890' }}>{s.durationMinutes} min</p>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `2px solid ${selected ? '#c9a84c' : '#c0b9b0'}` }}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#c9a84c' }} />}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            {step1Error && <p className="text-red-500 text-xs">{step1Error}</p>}

            <div className="flex items-center justify-center gap-5 flex-wrap">
              {['Sterile, single-use equipment', 'Female practitioners available', '5-star rated clinic'].map(t => (
                <div key={t} className="flex items-center gap-2 text-[11px]" style={{ color: '#8a9e98' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#c9a84c' }} />
                  {t}
                </div>
              ))}
            </div>

            <button type="button" onClick={goToStep2}
              className="w-full font-bold py-3.5 rounded-xl transition-colors text-sm"
              style={{ background: '#1a4a4a', color: '#fff' }}>
              Continue {selectedService ? `with ${selectedService.name}` : ''} →
            </button>
          </div>
        )}

        {/* ══ STEP 2: Appointment details ═══════════════════════════════════ */}
        {step === 2 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>Appointment Details</h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Choose your date, time, and how many people</p>
            </div>

            {/* Service summary bar */}
            {selectedService && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(26,74,74,0.06)', border: '1px solid rgba(26,74,74,0.12)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#c9a84c' }} />
                  <span className="text-sm font-semibold" style={{ color: '#1a4a4a' }}>{selectedService.name}</span>
                  <span className="text-xs" style={{ color: '#8a9e98' }}>· {selectedService.durationMinutes} min</span>
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-xs hover:underline" style={{ color: '#c9a84c' }}>Change</button>
              </div>
            )}

            <SectionDivider label="Date & Time" />

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Preferred Date *</label>
                <input
                  type="date"
                  value={apptDate}
                  onChange={e => setApptDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: '1.5px solid #d6d0c6', background: '#fff' }}
                />
                {step2Errors.date && <p className="text-red-500 text-xs mt-1">{step2Errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>Preferred Time *</label>
                <ArrowTimePicker value={apptTime} onChange={v => setApptTime(v)} />
                {step2Errors.time && <p className="text-red-500 text-xs mt-1">{step2Errors.time}</p>}
              </div>
            </div>

            {/* Slot availability indicator */}
            {(apptDate && apptTime) && (
              <div className="flex items-center gap-2">
                <SlotBadge slotInfo={slotInfo} groupSize={groupSize} loading={slotLoading} />
              </div>
            )}
            {step2Errors.slot && <p className="text-red-500 text-xs">{step2Errors.slot}</p>}

            <SectionDivider label="Group Size" />

            {/* How many people */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1a2420' }}>How many people? *</label>
              <p className="text-xs mb-3" style={{ color: '#8a9e98' }}>Up to 3 people can share a time slot. Each person requires their own health history.</p>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map(n => {
                  const active = groupSize === n
                  const spots = slotInfo?.available ?? 3
                  const disabled = !slotLoading && slotInfo !== null && n > spots
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => !disabled && setGroupSize(n)}
                      disabled={disabled}
                      className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl transition-all"
                      style={{
                        border: `1.5px solid ${active ? '#1a4a4a' : '#d6d0c6'}`,
                        background: active ? '#1a4a4a' : disabled ? '#f5f5f5' : '#fff',
                        color: active ? '#fff' : disabled ? '#ccc' : '#4a5e58',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.5 : 1,
                      }}
                    >
                      {n === 1 ? <User size={18} /> : <Users size={18} />}
                      <span className="text-sm font-bold">{n}</span>
                      <span className="text-[10px]">{n === 1 ? 'Person' : 'People'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

<div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}>
                ← Back
              </button>
              <button type="button" onClick={goToStep3}
                className="font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                style={{ flex: 2, background: '#1a4a4a', color: '#fff' }}>
                Next: Patient Info →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Patient info & health history ═════════════════════════ */}
        {step === 3 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>
                {groupSize > 1 ? 'Patient Details & Health History' : 'Your Details & Health History'}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>
                {groupSize > 1 ? `Complete details for all ${groupSize} patients` : 'Fill in your personal details and health history'}
              </p>
            </div>

            {/* Patient tabs (only shown for groups) */}
            {groupSize > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {patients.map((_, i) => {
                  const hasError = (step3Errors[i]?.length ?? 0) > 0
                  const isActive = activeTab === i
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setActiveTab(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0"
                      style={{
                        border: `1.5px solid ${isActive ? '#1a4a4a' : hasError ? '#fca5a5' : '#d6d0c6'}`,
                        background: isActive ? '#1a4a4a' : hasError ? '#fef2f2' : '#fff',
                        color: isActive ? '#fff' : hasError ? '#b91c1c' : '#4a5e58',
                      }}
                    >
                      <User size={13} />
                      Patient {i + 1}
                      {hasError && <span className="text-xs font-bold">!</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Active patient form */}
            <PatientForm
              patient={patients[activeTab]}
              index={activeTab}
              errors={step3Errors[activeTab] ?? []}
              onChange={(field, value) => updatePatient(activeTab, field, value)}
            />

            {/* Tab navigation */}
            {groupSize > 1 && (
              <div className="flex gap-2">
                {activeTab > 0 && (
                  <button type="button" onClick={() => { setActiveTab(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="flex-1 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                    style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}>
                    ← Patient {activeTab}
                  </button>
                )}
                {activeTab < groupSize - 1 && (
                  <button type="button" onClick={() => { setActiveTab(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="flex-1 font-bold py-2.5 rounded-xl text-sm transition-colors"
                    style={{ background: 'rgba(26,74,74,0.12)', color: '#1a4a4a', border: '1.5px solid rgba(26,74,74,0.2)' }}>
                    Patient {activeTab + 2} →
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}>
                ← Back
              </button>
              <button type="button" onClick={goToStep4}
                className="font-bold py-3 px-6 rounded-xl transition-colors text-sm"
                style={{ flex: 2, background: '#1a4a4a', color: '#fff' }}>
                Review &amp; Confirm →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 4: Confirm & pay ══════════════════════════════════════════ */}
        {step === 4 && (
          <div className="p-5 md:p-7 space-y-5">
            <div>
              <h2 className="font-bold" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, color: '#1a2420' }}>
                Review &amp; Confirm
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#8a9e98' }}>Everything look right? Read the consent and confirm.</p>
            </div>

            {/* Booking summary */}
            {selectedService && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #d6d0c6' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: '#1a4a4a' }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a84c' }}>Booking Summary</p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs hover:underline" style={{ color: 'rgba(255,255,255,0.55)' }}>Edit</button>
                </div>
                <div style={{ background: '#fff' }}>
                  {[
                    ['Service', selectedService.name],
                    ['Date', apptDate],
                    ['Time', apptTime],
                    ['Duration', `${selectedService.durationMinutes} min${groupSize === 3 ? ' (+ extra time for group)' : ''}`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-4 py-2.5 text-sm" style={{ borderBottom: '1px solid #f0ece4' }}>
                      <span style={{ color: '#8a9e98' }}>{label}</span>
                      <span className="font-semibold" style={{ color: '#1a2420' }}>{val}</span>
                    </div>
                  ))}

                  {/* Patients list */}
                  <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <p className="text-sm mb-2" style={{ color: '#8a9e98' }}>Patients</p>
                    {patients.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <User size={11} style={{ color: '#c9a84c', flexShrink: 0 }} />
                        <span className="text-sm font-semibold" style={{ color: '#1a2420' }}>{p.name}</span>
                        <span className="text-xs" style={{ color: '#8a9e98' }}>· {p.gender}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <span className="text-sm" style={{ color: '#8a9e98' }}>Deposit (due now)</span>
                    <span className="font-bold text-sm" style={{ color: '#b8892a' }}>£{depositTotal}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <span className="text-sm" style={{ color: '#8a9e98' }}>Remaining balance</span>
                    <span className="font-semibold text-sm" style={{ color: '#4a5e58' }}>£{Math.max(0, Number(selectedService.price) * groupSize - depositTotal)} at clinic</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-sm font-semibold" style={{ color: '#4a5e58' }}>Total</span>
                    <p style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a4a4a', lineHeight: 1 }}>
                      £{(Number(selectedService.price) * groupSize).toFixed(0)}
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
                <p className="text-sm font-semibold mb-1" style={{ color: '#b8892a' }}>£{depositTotal} deposit required to confirm</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6b5a3a' }}>
                  You will be taken to a secure Stripe payment page to pay the £{depositTotal} deposit.
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
                style={{ border: `1.5px solid ${consent ? '#1a4a4a' : '#d6d0c6'}`, background: consent ? 'rgba(26,74,74,0.06)' : '#fff' }}
              >
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 shrink-0 w-4 h-4 accent-[#1a4a4a]" />
                <span className="text-sm font-medium" style={{ color: '#1a2420' }}>
                  I have read and agree to the above — I consent to treatment for all listed patients.
                </span>
              </label>
              {consentError && <p className="text-red-500 text-xs mt-1">{consentError}</p>}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setStep(3)}
                className="flex-1 font-semibold py-3 rounded-xl transition-colors text-sm"
                style={{ border: '1.5px solid #d6d0c6', background: '#fff', color: '#1a4a4a' }}>
                ← Back
              </button>
              <button type="button" onClick={onSubmit} disabled={loading}
                className="font-bold py-3.5 px-6 rounded-xl transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ flex: 2, background: '#c9a84c', color: '#fff' }}>
                <CreditCard size={15} />
                {loading ? 'Redirecting to payment…' : `Pay £${depositTotal} Deposit`}
              </button>
            </div>

            <p className="text-center text-xs flex items-center justify-center gap-1" style={{ color: '#a09890' }}>
              <Lock size={10} /> Your information is secure and never shared with third parties
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
