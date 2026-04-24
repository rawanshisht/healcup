import Link from 'next/link'
import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'
import { Star, Shield, Heart, Clock, ChevronRight, Sparkles } from 'lucide-react'

const BENEFITS = [
  { icon: Heart, title: 'Promotes Healing', body: 'Stimulates blood flow, removes stagnant blood, and activates the body\'s natural healing response.' },
  { icon: Shield, title: 'Rooted in the Sunnah', body: 'Hijama is a Prophetic medicine recommended by the Prophet ﷺ and practised for over 1,400 years.' },
  { icon: Sparkles, title: 'Holistic Wellbeing', body: 'Addresses physical ailments, stress, fatigue, and supports overall mental and spiritual wellbeing.' },
  { icon: Star, title: 'Skilled Practitioners', body: 'Our certified practitioners follow strict hygiene protocols and provide personalised, compassionate care.' },
]

const TESTIMONIALS = [
  { name: 'Sister Fatima A.', text: 'Subhan\'Allah, such a professional and caring clinic. My chronic back pain improved significantly after just two sessions. The team made me feel so comfortable.' },
  { name: 'Brother Yusuf M.', text: 'I had been suffering from migraines for years. After hijama I felt the difference immediately. Highly recommend to anyone considering it.' },
  { name: 'Sister Maryam H.', text: 'The clinic is spotlessly clean, the sisters are kind and knowledgeable. It felt like a truly healing experience — body and soul.' },
]

const SUNNAH_DAYS = [17, 19, 21]

export default async function HomePage() {
  const activeServices = await db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(asc(services.sortOrder))

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="pattern-bg relative overflow-hidden min-h-screen flex flex-col py-4">
        {/* Layered depth overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2c2c]/90 via-[#1a4a4a]/85 to-[#0d3535]/90" />
        {/* Decorative radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#c9a84c]/5 blur-3xl pointer-events-none" />

        {/* All hero content in one unified block */}
        <div className="container-site relative z-10 flex-1 flex flex-col items-center justify-center text-center text-white px-6 py-28 md:py-36">

          {/* Bismillah badge */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#c9a84c]/50" />
            <p className="text-[#c9a84c] text-[11px] tracking-[0.35em] uppercase font-semibold">
              ﷽ &nbsp;In the Name of Allah
            </p>
            <span className="h-px w-10 bg-[#c9a84c]/50" />
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Healing Through
            <br />
            <span className="text-[#c9a84c]">the Sunnah</span>
          </h1>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>

          {/* Sub-heading */}
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed">
            Professional hijama (cupping therapy) in a safe, caring, and spiritually mindful environment.
            Rooted in Prophetic medicine. Grounded in modern hygiene standards.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/book"
              className="bg-[#c9a84c] hover:bg-[#b8892a] text-white font-bold px-10 py-4 rounded-md transition-colors text-base shadow-lg shadow-black/20"
            >
              Book an Appointment
            </Link>
            <Link
              href="/how-it-works"
              className="border border-white/30 hover:border-white/70 hover:bg-white/5 text-white font-medium px-10 py-4 rounded-md transition-colors text-base flex items-center justify-center gap-2"
            >
              How It Works <ChevronRight size={16} />
            </Link>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-6">
            {[
              { value: '500+', label: 'Patients treated' },
              { value: '100%', label: 'Sterile equipment' },
              { value: '5★', label: 'Rated clinic' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>{s.value}</p>
                <p className="text-white/55 text-xs mt-1 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────── */}
      <section className="py-20 pattern-light">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-[#b8892a] text-xs tracking-widest uppercase font-semibold mb-2">Why Hijama?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
              Benefits of Cupping Therapy
            </h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[#1e5c5c]" />
                </div>
                <h3 className="font-bold text-[#1a4a4a] mb-2 text-base" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services preview ──────────────────────────── */}
      <section className="py-20 bg-[#f2ede4]">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-[#b8892a] text-xs tracking-widest uppercase font-semibold mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Our Services</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeServices.map(s => (
              <div key={s.id} className="bg-white rounded-xl overflow-hidden border border-[#e0d9cf] shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1.5 bg-gradient-to-r from-[#237070] to-[#2a8a8a]" />
                <div className="p-5">
                  <h3 className="font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{s.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> {s.durationMinutes} min
                    </p>
                    <p className="text-lg font-bold text-[#1e5c5c]">£{Number(s.price).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-[#1e5c5c] font-semibold hover:text-[#237070] transition-colors">
              View all services & prices <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sunnah days ───────────────────────────────── */}
      <section className="py-16 bg-[#1a4a4a] text-white">
        <div className="container-site text-center">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-3">Prophetic Recommendation</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Sunnah Days for Hijama</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            The Prophet ﷺ recommended performing hijama on the 17th, 19th, and 21st of the Islamic lunar month.
            Mention your preferred Sunnah date when booking and we will do our best to accommodate you.
          </p>
          <div className="flex justify-center gap-5">
            {SUNNAH_DAYS.map(day => (
              <div key={day} className="w-16 h-16 rounded-full border-2 border-[#c9a84c] flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#c9a84c]">{day}</span>
                <span className="text-[9px] text-white/50 uppercase tracking-wider">lunar</span>
              </div>
            ))}
          </div>
          <Link href="/book" className="inline-block mt-8 bg-[#c9a84c] hover:bg-[#b8892a] text-white font-bold px-7 py-3 rounded-md transition-colors">
            Book on a Sunnah Day
          </Link>
        </div>
      </section>

      {/* ── How it works strip ────────────────────────── */}
      <section className="py-20 pattern-light">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-[#b8892a] text-xs tracking-widest uppercase font-semibold mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>How It Works</h2>
            <div className="gold-divider" />
          </div>
          {(() => {
            const steps = [
              { n: '01', title: 'Book Online', body: 'Fill in our short appointment request form — takes under 3 minutes.' },
              { n: '02', title: 'We Confirm', body: 'We review and confirm by WhatsApp or email, usually within a few hours.' },
              { n: '03', title: 'Attend & Heal', body: 'Arrive well rested. Your practitioner guides you through every step.' },
              { n: '04', title: 'Aftercare', body: 'Follow simple aftercare advice. Most patients feel benefits within 24 hours.' },
            ]
            return (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                {/* Desktop connector line */}
                <div className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#e0d9cf] via-[#c9a84c]/40 to-[#e0d9cf]" aria-hidden="true" />
                {steps.map((step, i) => (
                  <div key={step.n} className="text-center relative">
                    <div className="w-14 h-14 rounded-full bg-[#1a4a4a] text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-md relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                      {step.n}
                    </div>
                    <h3 className="font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
            )
          })()}
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-[#1e5c5c] font-semibold hover:text-[#237070]">
              Full guide with pre & post care <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="py-20 bg-[#f2ede4]">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="text-[#b8892a] text-xs tracking-widest uppercase font-semibold mb-2">Patient Experiences</p>
            <h2 className="text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>What Our Patients Say</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm relative overflow-hidden flex flex-col">
                <span
                  className="absolute top-2 right-4 text-8xl leading-none select-none pointer-events-none text-[#e8e3db]"
                  style={{ fontFamily: 'Georgia, serif' }}
                  aria-hidden="true"
                >&ldquo;</span>
                <div className="flex gap-0.5 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5 flex-1 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-[#f0ebe3]">
                  <div className="w-8 h-8 rounded-full bg-[#e6f4f4] flex items-center justify-center text-xs font-bold text-[#1e5c5c] shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-[#1e5c5c]">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="py-15 pattern-bg relative">
        <div className="absolute inset-0 bg-[#1a4a4a]/85" />
        <div className="container-site relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-4">
            Book your appointment today and take the first step towards better health, in the way of the Sunnah.
          </p>
          <Link href="/book" className="inline-block bg-[#c9a84c] hover:bg-[#b8892a] text-white font-bold px-10 py-4 rounded-md transition-colors text-base">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  )
}
