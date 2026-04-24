'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEPS = [
  { n: 1, title: 'Consultation',         desc: 'Your practitioner reviews your health history, goals, and any concerns. Your pre-screening questionnaire is checked to ensure hijama is appropriate for you.' },
  { n: 2, title: 'Preparation',          desc: 'You are guided to a private, comfortable treatment room. The area is cleaned with antiseptic and all equipment is sterile and single-use — opened in front of you.' },
  { n: 3, title: 'Dry Cupping Phase',    desc: 'Cups are placed on the skin and light suction applied. This creates a gentle pulling sensation that draws blood to the surface. Most patients find this deeply relaxing.' },
  { n: 4, title: 'Wet Hijama',           desc: 'Small, superficial scratches are made with a sterile lancet before the cup is replaced. This draws out a small amount of stagnant blood — the core practice of traditional hijama.' },
  { n: 5, title: 'Cleansing & Dressing', desc: 'The treatment area is thoroughly cleaned and dressed. Your practitioner checks on your comfort and ensures you feel well before leaving.' },
  { n: 6, title: 'Aftercare Guidance',   desc: 'Clear written and verbal aftercare instructions are provided before you leave. You are given contact details for any follow-up questions.' },
]

const CHUNKS = [STEPS.slice(0, 3), STEPS.slice(3, 6)]

export default function StepsSlider() {
  const [page, setPage]   = useState(0)
  const [dir,  setDir]    = useState<'fwd' | 'back'>('fwd')
  const [animKey, setAnimKey] = useState(0)

  const go = (next: number) => {
    if (next === page || next < 0 || next >= CHUNKS.length) return
    setDir(next > page ? 'fwd' : 'back')
    setPage(next)
    setAnimKey(k => k + 1)
  }

  const steps = CHUNKS[page]

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        .slide-fwd  { animation: slideInRight 0.32s cubic-bezier(0.25,0.46,0.45,0.94) both; }
        .slide-back { animation: slideInLeft  0.32s cubic-bezier(0.25,0.46,0.45,0.94) both; }
      `}</style>

      {/* ── Desktop: horizontal 3-col timeline ── */}
      <div className="hidden md:block overflow-hidden">
        <div
          key={animKey}
          className={dir === 'fwd' ? 'slide-fwd' : 'slide-back'}
        >
          <div className="relative">
            {/* Gold connector line — spans center-of-col-1 to center-of-col-3 */}
            <div
              className="absolute z-0 h-0.5"
              style={{
                top: 20,
                left: '16.67%',
                right: '16.67%',
                background: 'linear-gradient(to right, #c9a84c, #d4b060, #c9a84c)',
              }}
            />
            <div className="grid grid-cols-3 gap-5">
              {steps.map(s => (
                <div key={s.n} className="flex flex-col items-center">
                  {/* Node */}
                  <div
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 mb-5"
                    style={{
                      background: '#1a4a4a',
                      border: '3px solid #c9a84c',
                      boxShadow: '0 0 0 4px #faf7f2',
                    }}
                  >
                    <span
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 16, fontWeight: 700, color: '#fff' }}
                    >
                      {s.n}
                    </span>
                  </div>
                  {/* Card */}
                  <div
                    className="w-full flex-1 rounded-xl p-5"
                    style={{ background: '#fff', boxShadow: '0 2px 12px rgba(26,74,74,0.09)' }}
                  >
                    <h4
                      className="mb-2 leading-snug"
                      style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 600, color: '#1a2420' }}
                    >
                      {s.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <Nav page={page} go={go} />
      </div>

      {/* ── Mobile: vertical timeline ── */}
      <div className="md:hidden overflow-hidden">
        <div
          key={`m-${animKey}`}
          className={dir === 'fwd' ? 'slide-fwd' : 'slide-back'}
        >
          <div className="relative pl-[52px]">
            {/* Vertical gold line */}
            <div
              className="absolute w-0.5"
              style={{
                left: 19,
                top: 20,
                bottom: 20,
                background: 'linear-gradient(to bottom, #c9a84c, #d4b060)',
              }}
            />
            {steps.map((s, i) => (
              <div key={s.n} className={`relative ${i < steps.length - 1 ? 'pb-5' : ''}`}>
                {/* Node */}
                <div
                  className="absolute flex items-center justify-center w-10 h-10 rounded-full"
                  style={{
                    left: -52,
                    top: 0,
                    background: '#1a4a4a',
                    border: '2.5px solid #c9a84c',
                    boxShadow: '0 0 0 3px #faf7f2',
                  }}
                >
                  <span
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#fff' }}
                  >
                    {s.n}
                  </span>
                </div>
                {/* Card */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#fff', boxShadow: '0 2px 10px rgba(26,74,74,0.08)' }}
                >
                  <h4
                    className="mb-1.5 leading-snug"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 600, color: '#1a2420' }}
                  >
                    {s.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile nav */}
        <Nav page={page} go={go} />
      </div>
    </>
  )
}

function Nav({ page, go }: { page: number; go: (n: number) => void }) {
  const label = page === 0 ? 'Steps 1 – 3' : 'Steps 4 – 6'

  return (
    <div className="flex items-center justify-center gap-5 mt-8">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 0}
        className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors disabled:opacity-25"
        style={{ borderColor: '#c9a84c', color: '#1a4a4a' }}
        aria-label="Previous steps"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Dots + label */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-2">
          {CHUNKS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to page ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: page === i ? 24 : 8,
                height: 8,
                background: page === i ? '#c9a84c' : '#d1c9bc',
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold tracking-wider" style={{ color: '#8a9e98' }}>
          {label} of 6
        </span>
      </div>

      <button
        onClick={() => go(page + 1)}
        disabled={page === CHUNKS.length - 1}
        className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors disabled:opacity-25"
        style={{ borderColor: '#c9a84c', color: '#1a4a4a' }}
        aria-label="Next steps"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
