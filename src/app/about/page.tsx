import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Award, Heart, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = { title: 'About Us' }

const VALUES = [
  { icon: Heart,       title: 'Compassionate Care',    body: 'Every patient is treated with dignity, respect, and genuine concern for their wellbeing.' },
  { icon: ShieldCheck, title: 'Strict Hygiene',        body: 'We use single-use, sterile equipment for every session. Your safety is our highest priority.' },
  { icon: Award,       title: 'Qualified Practitioners', body: 'Our hijama therapists are certified, experienced, and committed to continuous learning.' },
  { icon: CheckCircle2,'title': 'Sunnah-Compliant',   body: 'All treatments follow Islamic principles and Prophetic guidance on hijama.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>About Our Clinic</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* Story */}
      <section className="py-16 pattern-light">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a4a] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            A Clinic Built on Faith & Care
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our clinic was founded with a single purpose: to make authentic, professional hijama therapy accessible to the Muslim community and beyond. We believe that the Prophetic medicine of hijama — when performed correctly and in a hygienic environment — can offer profound physical and spiritual benefits.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We are committed to maintaining the highest standards of safety, cleanliness, and patient care. Every session is conducted using sterile, single-use equipment, and every practitioner is trained to guide patients through the experience with warmth and expertise.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you are new to hijama or a returning patient, you will always be welcomed into a calm, respectful space where your comfort and healing come first.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#f2ede4]">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Our Values</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, body }: { icon: React.ElementType, title: string, body: string }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm text-center">
                <div className="w-12 h-12 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-[#1e5c5c]" />
                </div>
                <h3 className="font-bold text-[#1a4a4a] mb-2 text-sm" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1a4a4a] text-white text-center">
        <div className="container-site">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>Ready to Experience the Benefits?</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto text-sm">Book your appointment today and let us support your journey to better health.</p>
          <Link href="/book" className="inline-block bg-[#c9a84c] hover:bg-[#b8892a] text-white font-bold px-8 py-3 rounded-md transition-colors">
            Book an Appointment
          </Link>
        </div>
      </section>
    </>
  )
}
