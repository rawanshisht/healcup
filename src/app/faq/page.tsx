import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'FAQ' }

const FAQS = [
  {
    q: 'What is hijama (cupping therapy)?',
    a: 'Hijama is a traditional Islamic therapeutic practice in which cups are placed on the skin to create suction. In wet hijama, small superficial scratches are made before reapplying the cup to draw out stagnant blood. It has been practised for over 1,400 years and is firmly established in the Prophetic medicine.',
  },
  {
    q: 'Is hijama painful?',
    a: 'Most patients describe the sensation as a pulling or mild pressure — not pain. The dry cupping phase is entirely painless for most people. The wet hijama phase involves tiny, superficial scratches that cause minimal discomfort. Our practitioners work at your pace and ensure you are comfortable throughout.',
  },
  {
    q: 'How long does a session take?',
    a: 'Depending on the service, sessions range from 30 to 75 minutes. Please also allow a few minutes before your appointment for the consultation and a short wait after the session to ensure you feel well before leaving.',
  },
  {
    q: 'Is it safe? What hygiene standards do you follow?',
    a: 'Yes — when performed by a trained practitioner, hijama is very safe. We use sterile, single-use lancets and disposable cups for every patient. Equipment is opened in front of you. The treatment area is cleaned with antiseptic before and after every session.',
  },
  {
    q: 'Will the marks on my skin be permanent?',
    a: 'No. The circular marks (bruise-like discolouration) left by cupping are temporary and typically fade within 3 to 10 days, depending on your circulation and the treatment intensity.',
  },
  {
    q: 'Can women receive hijama?',
    a: 'Yes. We have female practitioners available for female patients. Please mention this when booking and we will ensure a female practitioner is assigned to your session.',
  },
  {
    q: 'What are the Sunnah days for hijama?',
    a: 'The Prophet ﷺ recommended performing hijama on the 17th, 19th, and 21st of the Islamic lunar month (Hijri calendar). When booking, you can mention that you would prefer a Sunnah date and we will do our best to accommodate your request.',
  },
  {
    q: 'How many sessions will I need?',
    a: 'This varies greatly depending on your health goals and condition. Many patients experience noticeable benefits after a single session. For chronic conditions, a series of 3–6 sessions spaced 4–8 weeks apart is often recommended. Your practitioner will discuss a personalised plan with you.',
  },
  {
    q: 'Do I need to fast before hijama?',
    a: 'You should not arrive on a completely empty stomach. Eat a light meal 2–3 hours before your session. Avoid heavy meals immediately before. Some scholars recommend being in a state of purity (wudu) for the spiritual benefits.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash and card payments at the clinic. Payment is made on the day of your appointment. We do not currently accept online payments at the time of booking.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'We ask that you cancel or reschedule at least 24 hours before your appointment. To cancel, please call or WhatsApp us directly. Late cancellations may affect your ability to rebook in the same week.',
  },
  {
    q: 'I have a health condition — can I still have hijama?',
    a: 'Please complete our pre-booking health screening form honestly. If any of your answers suggest hijama may not be suitable, we will ask you to contact us directly before attending. We always prioritise your safety.',
  },
]

export default function FAQPage() {
  return (
    <>
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Common Questions</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Frequently Asked Questions</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-16 pattern-light">
        <div className="container-site max-w-3xl mx-auto space-y-4">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-[#e0d9cf] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-[#1a4a4a] text-sm list-none hover:bg-[#f0f9f9] transition-colors">
                <span style={{ fontFamily: 'Georgia, serif' }}>{q}</span>
                <span className="ml-4 shrink-0 text-[#c9a84c] text-lg group-open:rotate-45 transition-transform inline-block">+</span>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-[#e0d9cf]">
                {a}
              </div>
            </details>
          ))}
        </div>
        <div className="container-site max-w-3xl mx-auto mt-10 text-center">
          <p className="text-sm text-gray-600 mb-4">Still have a question? We are happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-block bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white text-sm font-semibold px-6 py-2.5 rounded-md transition-colors">
              Contact Us
            </Link>
            <Link href="/book" className="inline-block bg-[#c9a84c] hover:bg-[#b8892a] text-white text-sm font-semibold px-6 py-2.5 rounded-md transition-colors">
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
