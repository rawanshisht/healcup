'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    cat: 'About Hijama',
    items: [
      {
        q: 'What is hijama (cupping therapy)?',
        a: 'Hijama is a traditional Islamic therapeutic practice in which cups are placed on the skin to create suction. In wet hijama, small superficial scratches are made before reapplying the cup to draw out stagnant blood. It has been practised for over 1,400 years and is firmly established in Prophetic medicine.',
      },
      {
        q: 'What is the difference between wet and dry cupping?',
        a: 'Dry cupping uses suction only to stimulate circulation and relieve tension — entirely non-invasive. Wet hijama (the traditional form) additionally involves light, superficial scarification to draw out small amounts of stagnant blood, which practitioners believe removes toxins and metabolic waste from the body.',
      },
      {
        q: 'What conditions can hijama help with?',
        a: 'Hijama has been used to support relief from back and neck pain, migraines, fatigue, high blood pressure, skin conditions, and general wellbeing. It is also practised as a preventative Sunnah treatment. Results vary by individual — please discuss your specific health goals with your practitioner.',
      },
      {
        q: 'What are the Sunnah days for hijama?',
        a: 'The Prophet ﷺ recommended performing hijama on the 17th, 19th, and 21st of the Islamic lunar month (Hijri calendar). When booking, mention that you would prefer a Sunnah date and we will do our best to accommodate your request.',
      },
    ],
  },
  {
    cat: 'Your Session',
    items: [
      {
        q: 'Is hijama painful?',
        a: 'Most patients describe the sensation as a pulling or mild pressure — not pain. The dry cupping phase is entirely painless for most people. The wet hijama phase involves tiny, superficial scratches that cause minimal discomfort. Our practitioners work at your pace and ensure you are comfortable throughout.',
      },
      {
        q: 'How long does a session take?',
        a: 'Depending on the service, sessions range from 30 to 75 minutes. The cupping itself takes around 20–30 minutes; the rest is preparation, consultation, and aftercare guidance. Please also allow a few minutes before your appointment for the initial consultation.',
      },
      {
        q: 'Do I need to prepare before my session?',
        a: 'You should not arrive on a completely empty stomach — eat a light meal 2–3 hours before your appointment. Stay well-hydrated and avoid strenuous exercise on the day. Wear or bring loose-fitting clothing that allows easy access to the treatment area.',
      },
      {
        q: 'Can women receive hijama?',
        a: 'Yes. We have female practitioners available for female patients. Please mention this when booking and we will ensure a female practitioner is assigned to your session.',
      },
      {
        q: 'How many sessions will I need?',
        a: 'This varies depending on your health goals and condition. Many patients experience noticeable benefits after a single session. For chronic conditions, a series of 3–6 sessions spaced 4–8 weeks apart is often recommended. Your practitioner will discuss a personalised plan with you.',
      },
    ],
  },
  {
    cat: 'Safety & Hygiene',
    items: [
      {
        q: 'Is it safe? What hygiene standards do you follow?',
        a: 'All equipment used is single-use and sterile — lancets, cups, and dressings are individually packaged and disposed of after each treatment. Our practitioners follow strict clinical hygiene protocols and wear protective gloves throughout. The clinic is cleaned and sanitised between every appointment.',
      },
      {
        q: 'Will the marks on my skin be permanent?',
        a: 'No. The circular marks left by cupping are caused by increased blood flow to the surface and typically fade within 3–10 days, depending on your skin type and the intensity of treatment. They are not bruises and cause no lasting skin damage.',
      },
      {
        q: 'I have a health condition — can I still have hijama?',
        a: 'Please complete our pre-booking health screening form honestly. Hijama is not suitable for everyone — for example, those on blood thinners, with active infections, or during pregnancy should consult us first. If any of your answers suggest hijama may not be appropriate, we will contact you before your appointment.',
      },
    ],
  },
  {
    cat: 'Booking & Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept cash and card payments at the clinic. Payment is made on the day of your appointment. We do not currently accept online payments at the time of booking.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'We ask that you cancel or reschedule at least 24 hours before your appointment. To cancel, please call or WhatsApp us directly. Late cancellations may affect your ability to rebook in the same week.',
      },
    ],
  },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.28s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M3 6l5 5 5-5" stroke="#1a4a4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key)

  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <section className="pattern-bg relative py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Common Questions</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Frequently Asked Questions</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* ── Accordion ──────────────────────────────────── */}
      <section className="py-10 md:py-14 pattern-light">
        <div className="container-site max-w-3xl mx-auto px-4">

          <div className="flex flex-col gap-7 md:gap-9">
            {FAQS.map((cat, ci) => (
              <div key={ci}>

                {/* Category header */}
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <span
                    className="text-[10px] md:text-[11px] font-bold tracking-[2.5px] uppercase whitespace-nowrap"
                    style={{ color: '#c9a84c' }}
                  >
                    {cat.cat}
                  </span>
                  <div className="flex-1 h-px" style={{ background: '#e6e2d8' }} />
                </div>

                {/* Questions container */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#ffffff', boxShadow: '0 2px 14px rgba(26,74,74,0.07)' }}
                >
                  {cat.items.map((item, ii) => {
                    const key = `${ci}-${ii}`
                    const isOpen = openKey === key
                    const isLast = ii === cat.items.length - 1

                    return (
                      <div
                        key={ii}
                        style={{ borderBottom: isLast ? 'none' : '1px solid #e6e2d8' }}
                      >
                        {/* Question button */}
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between gap-3 md:gap-4 text-left transition-colors duration-150"
                          style={{
                            padding: '16px 18px',
                            background: isOpen ? 'transparent' : undefined,
                          }}
                          onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = '#faf7f2' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                        >
                          <span
                            className="text-sm md:text-[15.5px] font-semibold leading-snug transition-colors duration-150"
                            style={{ color: isOpen ? '#1a4a4a' : '#1a2420' }}
                          >
                            {item.q}
                          </span>
                          <Chevron open={isOpen} />
                        </button>

                        {/* Answer */}
                        {isOpen && (
                          <div
                            className="px-[18px] pb-4 md:pb-5"
                            style={{ animation: 'slideDown 0.22s ease' }}
                          >
                            <div
                              className="pl-3 md:pl-4"
                              style={{ borderLeft: '3px solid #c9a84c' }}
                            >
                              <p
                                className="text-sm md:text-[14.5px] leading-relaxed"
                                style={{ color: '#4a5e58' }}
                              >
                                {item.a}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 md:mt-12 text-center">
            <p
              className="italic mb-4 md:mb-5 text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                color: '#4a5e58',
              }}
            >
              Still have questions? We&apos;re happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-block text-white text-sm font-semibold px-7 py-3 rounded-lg transition-colors"
                style={{ background: '#1a4a4a' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#1e5c5c')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#1a4a4a')}
              >
                Contact Us
              </Link>
              <Link
                href="/book"
                className="inline-block text-white text-sm font-semibold px-7 py-3 rounded-lg transition-colors"
                style={{ background: '#c9a84c' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#b8892a')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#c9a84c')}
              >
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
