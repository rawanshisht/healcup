import type { Metadata } from 'next'
import { Phone, Mail, MapPin, MessageCircle, Facebook } from 'lucide-react'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import type { ContactInfo } from '@/app/admin/content/defaults'
import { DEFAULT_CONTACT_INFO } from '@/app/admin/content/defaults'

export const metadata: Metadata = { title: 'Contact Us' }

async function getContactInfo(): Promise<ContactInfo> {
  const rows = await db.select().from(siteContent).where(eq(siteContent.key, 'contact_info'))
  return rows.length ? (rows[0].value as ContactInfo) : DEFAULT_CONTACT_INFO
}

export default async function ContactPage() {
  const contact = await getContactInfo()

  const { address, phone, email, whatsapp, facebook } = contact

  return (
    <>
      <section className="pattern-bg relative py-12 sm:py-16 md:py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Contact Us</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-16 pattern-light">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>How to Reach Us</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We welcome all enquiries. The quickest way to reach us is via WhatsApp or phone.
                For appointment bookings, we recommend using our online booking form.
              </p>

              {[
                { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone}` },
                { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
                { icon: MapPin, label: 'Address', value: address, href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target={label === 'Address' ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#e0d9cf] hover:border-[#2a8a8a] transition-colors group">
                  <div className="w-9 h-9 bg-[#e6f4f4] rounded-full flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#1e5c5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-[#1a4a4a] group-hover:text-[#237070] transition-colors">{value}</p>
                  </div>
                </a>
              ))}

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I have an enquiry about hijama appointments.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle size={16} />
                  Message Us on WhatsApp
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                >
                  <Facebook size={16} />
                  Visit Our Facebook Page
                </a>
              )}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-[#e0d9cf] shadow-sm bg-[#e6f4f4] flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
              <MapPin size={40} className="text-[#2a8a8a] mb-3 opacity-50" />
              <p className="text-[#1a4a4a] font-semibold mb-2">{address}</p>
              <p className="text-sm text-gray-500 mb-4">Add your Google Maps embed here</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
