'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save, FileText, BookOpen } from 'lucide-react'

import type { AboutContent, HowItWorksContent } from './defaults'

type Tab = 'about' | 'how_it_works'

const input  = 'w-full border border-[#e0d9cf] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#237070] transition'
const label  = 'text-[11px] font-semibold uppercase tracking-wide text-gray-400 block mb-1.5'

function Field({ lbl, children }: { lbl: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={label}>{lbl}</label>
      {children}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e0d9cf] shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 py-4 border-b border-[#e0d9cf] bg-[#faf7f2]">
      <p className="font-bold text-[#1a4a4a] text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function SaveBar({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e0d9cf] px-6 py-4 flex items-center justify-between gap-4">
      <p className="text-xs text-gray-400">Changes are published to the live site immediately after saving.</p>
      <button
        onClick={onClick}
        disabled={saving}
        className="flex items-center gap-2 bg-[#1a4a4a] hover:bg-[#1e5c5c] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shrink-0"
      >
        <Save size={14} />
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

export default function ContentManager({
  initialAbout,
  initialHowItWorks,
}: {
  initialAbout: AboutContent
  initialHowItWorks: HowItWorksContent
}) {
  const [tab, setTab] = useState<Tab>('about')

  // ── About ─────────────────────────────────────────────────
  const [about, setAbout]           = useState<AboutContent>(initialAbout)
  const [savingAbout, setSavingAbout] = useState(false)

  const saveAbout = async () => {
    setSavingAbout(true)
    const res = await fetch('/api/site-content/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(about),
    })
    setSavingAbout(false)
    res.ok ? toast.success('About page saved') : toast.error('Failed to save')
  }

  const setAboutField = (field: string, val: string) =>
    setAbout(a => ({ ...a, [field]: val }))

  const setValueCard = (i: number, field: 'title' | 'body', val: string) =>
    setAbout(a => ({ ...a, values: a.values.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }))

  // ── How It Works ──────────────────────────────────────────
  const [hiw, setHiw]           = useState<HowItWorksContent>(initialHowItWorks)
  const [savingHiw, setSavingHiw] = useState(false)

  const saveHiw = async () => {
    setSavingHiw(true)
    const res = await fetch('/api/site-content/how_it_works', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hiw),
    })
    setSavingHiw(false)
    res.ok ? toast.success('How It Works saved') : toast.error('Failed to save')
  }

  const setStep = (i: number, field: 'title' | 'desc', val: string) =>
    setHiw(h => ({ ...h, steps: h.steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }))

  const setList = (field: 'before' | 'after' | 'unsuitable', val: string) =>
    setHiw(h => ({ ...h, [field]: val.split('\n') }))

  // ── Tabs ──────────────────────────────────────────────────
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'about',        label: 'About Page',    icon: FileText },
    { key: 'how_it_works', label: 'How It Works',  icon: BookOpen },
  ]

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar */}
      <div className="flex border-b border-[#e0d9cf] bg-white rounded-t-2xl overflow-hidden">
        {tabs.map(({ key, label: lbl, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === key
                ? 'border-[#237070] text-[#1a4a4a]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={15} />
            {lbl}
          </button>
        ))}
      </div>

      {/* ── About Tab ── */}
      {tab === 'about' && (
        <div className="space-y-4 pt-4">
          {/* Clinic Story */}
          <Card>
            <CardHeader title="Clinic Story" subtitle="The text in the 'Our Story' section on the About page." />
            <div className="p-6 space-y-4">
              <Field lbl="Section Heading">
                <input
                  className={input}
                  value={about.storyHeading}
                  onChange={e => setAboutField('storyHeading', e.target.value)}
                />
              </Field>
              {(['paragraph1', 'paragraph2', 'paragraph3'] as const).map((f, i) => (
                <Field key={f} lbl={`Paragraph ${i + 1}`}>
                  <textarea
                    className={`${input} resize-none`}
                    rows={3}
                    value={about[f]}
                    onChange={e => setAboutField(f, e.target.value)}
                  />
                </Field>
              ))}
            </div>
          </Card>

          {/* Values */}
          <Card>
            <CardHeader title="Our Values" subtitle="Four cards shown in the values section." />
            <div className="divide-y divide-[#e0d9cf]">
              {about.values.map((v, i) => (
                <div key={i} className="p-5 flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#e6f4f4] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-[#1e5c5c]">{i + 1}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field lbl="Title">
                      <input
                        className={input}
                        value={v.title}
                        onChange={e => setValueCard(i, 'title', e.target.value)}
                      />
                    </Field>
                    <Field lbl="Description">
                      <textarea
                        className={`${input} resize-none`}
                        rows={2}
                        value={v.body}
                        onChange={e => setValueCard(i, 'body', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <SaveBar onClick={saveAbout} saving={savingAbout} />
        </div>
      )}

      {/* ── How It Works Tab ── */}
      {tab === 'how_it_works' && (
        <div className="space-y-4 pt-4">
          {/* Steps */}
          <Card>
            <CardHeader title="Treatment Steps" subtitle="The 6 steps shown on the How It Works page." />
            <div className="divide-y divide-[#e0d9cf]">
              {hiw.steps.map((s, i) => (
                <div key={i} className="p-5 flex gap-4 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 border-[#c9a84c]"
                    style={{ background: '#1a4a4a' }}
                  >
                    <span className="text-xs font-bold text-white">{s.n}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                    <Field lbl="Step Title">
                      <input
                        className={input}
                        value={s.title}
                        onChange={e => setStep(i, 'title', e.target.value)}
                      />
                    </Field>
                    <Field lbl="Description">
                      <textarea
                        className={`${input} resize-none`}
                        rows={2}
                        value={s.desc}
                        onChange={e => setStep(i, 'desc', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Before & After — side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="Before Appointment" subtitle="One item per line." />
              <div className="p-5">
                <textarea
                  className={`${input} resize-none`}
                  rows={8}
                  value={hiw.before.join('\n')}
                  onChange={e => setList('before', e.target.value)}
                />
              </div>
            </Card>
            <Card>
              <CardHeader title="After Appointment" subtitle="One item per line." />
              <div className="p-5">
                <textarea
                  className={`${input} resize-none`}
                  rows={8}
                  value={hiw.after.join('\n')}
                  onChange={e => setList('after', e.target.value)}
                />
              </div>
            </Card>
          </div>

          {/* Unsuitable */}
          <Card>
            <CardHeader title="When Hijama May Not Be Suitable" subtitle="Conditions listed in the warning box. One item per line." />
            <div className="p-5">
              <textarea
                className={`${input} resize-none`}
                rows={7}
                value={hiw.unsuitable.join('\n')}
                onChange={e => setList('unsuitable', e.target.value)}
              />
            </div>
          </Card>

          <SaveBar onClick={saveHiw} saving={savingHiw} />
        </div>
      )}
    </div>
  )
}
