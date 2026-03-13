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
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Transparent Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Services & Prices</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-16 pattern-light">
        <div className="container-site max-w-4xl mx-auto">
          <div className="space-y-6">
            {allServices.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-[#e0d9cf] shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="w-1.5 md:w-2 bg-gradient-to-b from-[#237070] to-[#2a8a8a] shrink-0" />
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>{s.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} /> {s.durationMinutes} minutes
                        </span>
                        {s.restrictions && (
                          <span className="text-xs bg-[#fdf6e3] text-[#b8892a] border border-[#c9a84c]/30 px-2 py-0.5 rounded-full">
                            {s.restrictions}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#1e5c5c]">£{Number(s.price).toFixed(0)}</p>
                      <p className="text-xs text-gray-400">per session</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{s.description}</p>
                  <Link
                    href={`/book?service=${s.id}`}
                    className="inline-block mt-4 bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white text-sm font-semibold px-5 py-2 rounded-md transition-colors"
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-12 bg-[#f2ede4]">
        <div className="container-site max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-[#1a4a4a] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
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
    </>
  )
}
