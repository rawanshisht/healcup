export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Award, Heart, ShieldCheck, Leaf } from 'lucide-react'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { DEFAULT_ABOUT } from '@/app/admin/content/defaults'
import type { AboutContent } from '@/app/admin/content/defaults'

export const metadata: Metadata = { title: 'About Us' }

const VALUE_ICONS = [Heart, ShieldCheck, Award, Leaf]

export default async function AboutPage() {
  const rows = await db.select().from(siteContent).where(eq(siteContent.key, 'about'))
  const content: AboutContent = rows.length ? (rows[0].value as AboutContent) : DEFAULT_ABOUT

  return (
    <>
      {/* Hero */}
      <section className="pattern-bg relative py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>About Our Clinic</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      {/* Story */}
      <section className="py-10 sm:py-14 md:py-16 pattern-light">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a4a] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {content.storyHeading}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">{content.paragraph1}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{content.paragraph2}</p>
          <p className="text-gray-700 leading-relaxed">{content.paragraph3}</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-14 md:py-16 bg-[#f2ede4]">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Our Values</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map(({ title, body }, i) => {
              const Icon = VALUE_ICONS[i] ?? Heart
              return (
                <div key={i} className="bg-white rounded-xl p-6 border border-[#e0d9cf] shadow-sm text-center">
                  <div className="w-12 h-12 bg-[#e6f4f4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-[#1e5c5c]" />
                  </div>
                  <h3 className="font-bold text-[#1a4a4a] mb-2 text-sm" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-14 md:py-16 bg-[#1a4a4a] text-white text-center">
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
