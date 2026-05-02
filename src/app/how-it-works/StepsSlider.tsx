'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Step = { n: number; title: string; desc: string }

export default function StepsSlider({ steps }: { steps: Step[] }) {
  const chunks = [steps.slice(0, 3), steps.slice(3, 6)]

  const [page, setPage]   = useState(0)
  const [dir,  setDir]    = useState<'fwd' | 'back'>('fwd')
  const [animKey, setAnimKey] = useState(0)

  const go = (next: number) => {
    if (next === page || next < 0 || next >= chunks.length) return
    setDir(next > page ? 'fwd' : 'back')
    setPage(next)
    setAnimKey(k => k + 1)
  }

  const currentSteps = chunks[page]

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
        <div key={animKey} className={dir === 'fwd' ? 'slide-fwd' : 'slide-back'}>
          <div className="relative">
            <div
              className="absolute z-0 h-0.5"
              style={{ top: 20, left: '16.67%', right: '16.67%', background: 'linear-gradient(to right, #c9a84c, #d4b060, #c9a84c)' }}
            />
            <div className="grid grid-cols-3 gap-5">
              {currentSteps.map(s => (
                <div key={s.n} className="flex flex-col items-center">
                  <div
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 mb-5"
                    style={{ background: '#1a4a4a', border: '3px solid #c9a84c', boxShadow: '0 0 0 4px #faf7f2' }}
                  >
                    <span style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>{s.n}</span>
                  </div>
                  <div className="w-full flex-1 rounded-xl p-5" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(26,74,74,0.09)' }}>
                    <h4 className="mb-2 leading-snug" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 600, color: '#1a2420' }}>{s.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Nav page={page} go={go} total={chunks.length} />
      </div>

      {/* ── Mobile: vertical timeline ── */}
      <div className="md:hidden overflow-hidden">
        <div key={`m-${animKey}`} className={dir === 'fwd' ? 'slide-fwd' : 'slide-back'}>
          <div className="relative pl-[52px]">
            <div className="absolute w-0.5" style={{ left: 19, top: 20, bottom: 20, background: 'linear-gradient(to bottom, #c9a84c, #d4b060)' }} />
            {currentSteps.map((s, i) => (
              <div key={s.n} className={`relative ${i < currentSteps.length - 1 ? 'pb-5' : ''}`}>
                <div
                  className="absolute flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ left: -52, top: 0, background: '#1a4a4a', border: '2.5px solid #c9a84c', boxShadow: '0 0 0 3px #faf7f2' }}
                >
                  <span style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.n}</span>
                </div>
                <div className="rounded-xl p-4" style={{ background: '#fff', boxShadow: '0 2px 10px rgba(26,74,74,0.08)' }}>
                  <h4 className="mb-1.5 leading-snug" style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 19, fontWeight: 600, color: '#1a2420' }}>{s.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a5e58' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Nav page={page} go={go} total={chunks.length} />
      </div>
    </>
  )
}

function Nav({ page, go, total }: { page: number; go: (n: number) => void; total: number }) {
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
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to page ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{ width: page === i ? 24 : 8, height: 8, background: page === i ? '#c9a84c' : '#d1c9bc' }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold tracking-wider" style={{ color: '#8a9e98' }}>{label} of 6</span>
      </div>
      <button
        onClick={() => go(page + 1)}
        disabled={page === total - 1}
        className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors disabled:opacity-25"
        style={{ borderColor: '#c9a84c', color: '#1a4a4a' }}
        aria-label="Next steps"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
