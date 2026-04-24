import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'
import { Clock, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Services & Prices' }

export default async function ServicesPage() {
  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(asc(services.sortOrder))

  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Transparent Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Services &amp; Prices</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* ── Cards ──────────────────────────────────────── */}
      <section className="py-14 pattern-light">
        <div className="container-site max-w-4xl mx-auto px-4">
          <div className="flex flex-col gap-3 md:gap-3.5">
            {allServices.map(s => (
              <div
                key={s.id}
                className="rounded-xl overflow-hidden"
                style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(26,74,74,0.08)' }}
              >
                {/* ── Mobile: stacked (content top / price strip bottom) ── */}
                <div className="md:hidden">
                  <div className="px-[18px] pt-[18px] pb-[14px]">
                    <h2
                      className="leading-tight mb-1.5"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 22, fontWeight: 600, color: '#1a2420' }}
                    >
                      {s.name}
                    </h2>
                    <p className="text-sm leading-relaxed mb-2.5" style={{ color: '#4a5e58' }}>{s.description}</p>
                    {s.restrictions && (
                      <p className="text-xs mb-2" style={{ color: '#7a8e88' }}>⚠ {s.restrictions}</p>
                    )}
                    <span className="text-xs" style={{ color: '#7a8e88' }}>⏱ {s.durationMinutes} min</span>
                  </div>
                  <div
                    className="flex items-center justify-between px-[18px] py-[14px]"
                    style={{ background: '#1a4a4a', borderTop: '2px solid #c9a84c' }}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span
                        style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 30, fontWeight: 700, color: '#ffffff' }}
                      >
                        £{Number(s.price).toFixed(0)}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>/ session</span>
                    </div>
                    <Link
                      href={`/book?service=${s.id}`}
                      className="rounded-lg text-sm font-bold py-2.5 px-5 transition-opacity hover:opacity-90"
                      style={{ background: '#c9a84c', color: '#1a1000' }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* ── Desktop/tablet: split (content left / price block right) ── */}
                <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr auto' }}>
                  <div className="p-7 flex flex-col">
                    <div className="flex items-baseline gap-3 flex-wrap mb-2.5">
                      <h2
                        className="leading-none"
                        style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 600, color: '#1a2420' }}
                      >
                        {s.name}
                      </h2>
                      {s.restrictions && (
                        <span className="text-xs font-medium" style={{ color: '#7a8e88' }}>— {s.restrictions}</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a5e58', maxWidth: 520 }}>{s.description}</p>
                    <div className="flex items-center gap-1.5 mt-4">
                      <Clock size={13} style={{ color: '#7a8e88' }} />
                      <span className="text-xs font-medium" style={{ color: '#7a8e88' }}>{s.durationMinutes} minutes</span>
                    </div>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center gap-1.5 px-8 py-7"
                    style={{ background: '#1a4a4a', minWidth: 160, borderLeft: '3px solid #c9a84c' }}
                  >
                    <span
                      className="leading-none"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(2.2rem, 3vw, 2.8rem)', fontWeight: 700, color: '#ffffff' }}
                    >
                      £{Number(s.price).toFixed(0)}
                    </span>
                    <span className="text-xs font-medium mb-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>per session</span>
                    <Link
                      href={`/book?service=${s.id}`}
                      className="w-full text-center rounded-lg text-sm font-bold py-2.5 px-5 transition-opacity hover:opacity-90 whitespace-nowrap"
                      style={{ background: '#c9a84c', color: '#1a1000' }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-center mt-9 italic"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 15, color: '#7a8e88' }}
          >
            All sessions conducted by certified practitioners in a private, sterile environment.
          </p>
        </div>
      </section>

      {/* ── What's included ────────────────────────────── */}
      <section className="py-12 bg-[#f2ede4]">
        <div className="container-site max-w-2xl mx-auto text-center px-4">
          <h2
            className="text-xl font-bold text-[#1a4a4a] mb-6"
            style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
          >
            Every Session Includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              'Sterile, single-use equipment',
              'Full consultation before treatment',
              'Pre-treatment health screening',
              'Aftercare instructions provided',
              'Private, comfortable treatment room',
              'Gender-appropriate practitioner available',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 size={16} className="text-[#237070] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-10" style={{ background: '#1a4a4a' }}>
        <div className="container-site max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl">
          <div>
            <p
              className="font-medium text-white"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 22 }}
            >
              Not sure which treatment is right for you?
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Book a free 10-minute consultation.
            </p>
          </div>
          <Link
            href="/book"
            className="shrink-0 rounded-lg px-7 py-3 text-sm font-bold transition-colors"
            style={{ background: '#c9a84c', color: '#1a1000' }}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
