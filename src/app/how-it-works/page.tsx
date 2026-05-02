export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import StepsSlider from './StepsSlider'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { DEFAULT_HOW_IT_WORKS } from '@/app/admin/content/defaults'
import type { HowItWorksContent } from '@/app/admin/content/defaults'

export const metadata: Metadata = { title: 'How It Works' }

function CheckIcon({ color = '#c9a84c' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="7.5" stroke={color} strokeWidth="1" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default async function HowItWorksPage() {
  const rows = await db.select().from(siteContent).where(eq(siteContent.key, 'how_it_works'))
  const content: HowItWorksContent = rows.length ? (rows[0].value as HowItWorksContent) : DEFAULT_HOW_IT_WORKS

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="pattern-bg relative py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Your Complete Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>How It Works</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* ── What to Expect ── */}
      <section className="pattern-light pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12">
        <div className="container-site">
          <div className="text-center mb-10 md:mb-12">
            <p className="font-semibold uppercase mb-2.5" style={{ fontSize: 11, letterSpacing: 3, color: '#c9a84c' }}>Your Journey</p>
            <h2 className="leading-tight" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 600, color: '#1a2420' }}>
              What to Expect
            </h2>
            <div className="w-10 h-0.5 mx-auto mt-3.5" style={{ background: '#c9a84c' }} />
          </div>
          <StepsSlider steps={content.steps} />
        </div>
      </section>

      {/* ── DESKTOP: Before / After ── */}
      <div className="hidden md:grid grid-cols-2" style={{ marginTop: 52 }}>
        <div className="relative overflow-hidden px-12 py-11" style={{ background: '#1a4a4a' }}>
          <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <pattern id="ba-dot" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="0.7" fill="#c9a84c" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#ba-dot)" />
          </svg>
          <div className="relative z-10">
            <p className="text-[10.5px] font-semibold tracking-[2.5px] uppercase mb-1.5" style={{ color: '#c9a84c' }}>Before Your Appointment</p>
            <h3 className="mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 32, fontWeight: 600, color: '#fff' }}>How to Prepare</h3>
            <div className="flex flex-col gap-3">
              {content.before.map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <CheckIcon color="#c9a84c" />
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-12 py-11" style={{ background: '#fdf3e3', borderLeft: '3px solid #e8b860' }}>
          <p className="text-[10.5px] font-semibold tracking-[2.5px] uppercase mb-1.5" style={{ color: '#c9a84c' }}>After Your Appointment</p>
          <h3 className="mb-6 leading-tight" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 32, fontWeight: 600, color: '#1a2420' }}>Recovery &amp; Care</h3>
          <div className="flex flex-col gap-3">
            {content.after.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <CheckIcon color="#c9a84c" />
                <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE: Before / After ── */}
      <div className="md:hidden pattern-light px-5 pt-6 pb-0 flex flex-col gap-3.5">
        <div className="rounded-xl px-[22px] py-7" style={{ background: '#1a4a4a' }}>
          <p className="text-[10px] font-semibold tracking-[2.5px] uppercase mb-2" style={{ color: '#c9a84c' }}>Before Your Appointment</p>
          <h3 className="mb-5 leading-tight" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 600, color: '#fff' }}>How to Prepare</h3>
          <div className="flex flex-col gap-2.5">
            {content.before.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <CheckIcon color="#c9a84c" />
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl px-[22px] py-7" style={{ background: '#fdf3e3', borderLeft: '3px solid #e8b860' }}>
          <p className="text-[10px] font-semibold tracking-[2.5px] uppercase mb-2" style={{ color: '#c9a84c' }}>After Your Appointment</p>
          <h3 className="mb-5 leading-tight" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 26, fontWeight: 600, color: '#1a2420' }}>Recovery &amp; Care</h3>
          <div className="flex flex-col gap-2.5">
            {content.after.map((item, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <CheckIcon color="#c9a84c" />
                <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Warning box ── */}
      <section className="pattern-light px-5 pt-9 pb-14 md:py-10">
        <div className="container-site max-w-4xl mx-auto">
          <div className="rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-7 items-start" style={{ background: '#2a1a08' }}>
            <div className="flex items-center justify-center w-10 h-10 md:w-[42px] md:h-[42px] rounded-full shrink-0 text-xl" style={{ background: '#e8b860' }}>⚠</div>
            <div className="flex-1">
              <h4 className="mb-1.5 leading-snug" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 22, fontWeight: 600, color: '#fff' }}>
                When Hijama May Not Be Suitable
              </h4>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Hijama is not suitable for everyone. Our pre-booking health questionnaire screens for the following conditions.
                If any apply, please contact us before booking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {content.unsuitable.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#e8b860' }}>—</span>
                    <p className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.72)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-[#1a4a4a] text-white text-center">
        <div className="container-site">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Ready to Book?</h2>
          <p className="text-white/70 mb-6 text-sm">Our team is here to answer any questions before you book.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="inline-block font-bold px-7 py-3 rounded-md transition-colors text-sm" style={{ background: '#c9a84c', color: '#fff' }}>
              Book an Appointment
            </Link>
            <Link href="/faq" className="inline-block border border-white/40 hover:border-white text-white font-medium px-7 py-3 rounded-md transition-colors text-sm">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
