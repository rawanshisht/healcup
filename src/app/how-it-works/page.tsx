import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Droplets, Wind } from 'lucide-react'

export const metadata: Metadata = { title: 'How It Works' }

const PRE_CARE = [
  'Eat a light meal at least 2 hours before your appointment — do not arrive on a completely empty stomach.',
  'Shower and wear clean, loose, dark-coloured clothing (cups may leave temporary marks).',
  'Stay well hydrated — drink plenty of water the day before and the morning of your appointment.',
  'Avoid strenuous exercise for 24 hours before treatment.',
  'Do not shave the treatment area on the day of your appointment.',
  'Inform us of any medications, health conditions, or concerns before your session begins.',
]

const AFTERCARE = [
  'Rest for the remainder of the day — avoid strenuous activity for at least 24 hours.',
  'Avoid cold water, cold showers, or swimming for at least 24 hours after treatment.',
  'Eat light, nutritious food after your session. Honey and dates are Sunnah recommendations.',
  'Keep the treatment area clean and covered if needed.',
  'Drink plenty of water to aid detoxification.',
  'The circular marks from cupping are normal and will fade within 3–10 days.',
  'Contact us if you experience any unusual pain, excessive bruising, or signs of infection.',
]

const CONTRAINDICATIONS = [
  'Currently taking blood thinners or anticoagulant medication',
  'Active open wounds, skin infections, or eczema at the treatment site',
  'Fever or acute illness on the day of treatment',
  'Pregnancy (please consult us — some forms may be appropriate)',
  'Severe anaemia or blood disorders',
  'Very recent surgery (within the past 4 weeks)',
]

export default function HowItWorksPage() {
  return (
    <>
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Your Complete Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>How It Works</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 pattern-light">
        <div className="container-site max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>What to Expect</h2>
            <div className="gold-divider" />
          </div>
          <div className="space-y-6">
            {[
              { n: '1', title: 'Consultation',        body: 'Before every session, your practitioner discusses your health history, goals, and any concerns. Your pre-screening questionnaire is reviewed to ensure hijama is appropriate for you.' },
              { n: '2', title: 'Preparation',         body: 'You will be guided to a private, comfortable treatment room. The treatment area is cleaned with antiseptic. All equipment is sterile and single-use — opened in front of you.' },
              { n: '3', title: 'Dry Cupping Phase',   body: 'Cups are placed on the skin and light suction is applied. This creates a gentle pulling sensation that draws blood to the surface. Most patients find this deeply relaxing.' },
              { n: '4', title: 'Wet Hijama (if applicable)', body: 'For wet hijama, small, superficial scratches are made with a sterile lancet before the cup is replaced. This draws out a small amount of stagnant blood — the core practice of traditional hijama.' },
              { n: '5', title: 'Cleansing & Dressing', body: 'The treatment area is thoroughly cleaned and dressed. Your practitioner checks on your comfort and ensures you feel well before leaving.' },
              { n: '6', title: 'Aftercare Guidance',  body: 'You receive clear written and verbal aftercare instructions before you leave. You are encouraged to rest and are given contact details for any follow-up questions.' },
            ].map(step => (
              <div key={step.n} className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-[#1a4a4a] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                  {step.n}
                </div>
                <div>
                  <h3 className="font-bold text-[#1a4a4a] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre and Aftercare */}
      <section className="py-16 bg-[#f2ede4]">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#e6f4f4] rounded-full flex items-center justify-center">
                  <Droplets size={16} className="text-[#1e5c5c]" />
                </div>
                <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Before Your Appointment</h2>
              </div>
              <ul className="space-y-2.5">
                {PRE_CARE.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-[#237070] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#fdf6e3] rounded-full flex items-center justify-center">
                  <Wind size={16} className="text-[#b8892a]" />
                </div>
                <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>After Your Appointment</h2>
              </div>
              <ul className="space-y-2.5">
                {AFTERCARE.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-[#c9a84c] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contraindications */}
      <section className="py-12 pattern-light">
        <div className="container-site max-w-3xl mx-auto">
          <div className="bg-[#fff9ed] border border-[#c9a84c]/40 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-[#b8892a]" />
              <h2 className="text-lg font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
                When Hijama May Not Be Suitable
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Hijama is not suitable for everyone. Our pre-booking health questionnaire screens for the following conditions. If any apply to you, please contact us before booking.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTRAINDICATIONS.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#b8892a] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#1a4a4a] text-white text-center">
        <div className="container-site">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Ready to Book?</h2>
          <p className="text-white/70 mb-6 text-sm">Our team is here to answer any questions before you book.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="inline-block bg-[#c9a84c] hover:bg-[#b8892a] text-white font-bold px-7 py-3 rounded-md transition-colors">
              Book an Appointment
            </Link>
            <Link href="/faq" className="inline-block border border-white/40 hover:border-white text-white font-medium px-7 py-3 rounded-md transition-colors">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
