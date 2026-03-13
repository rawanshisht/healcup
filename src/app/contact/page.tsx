import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact Us' }

export default function ContactPage() {
  const phone    = process.env.NEXT_PUBLIC_CLINIC_PHONE    ?? '+44 700 000 0000'
  const email    = process.env.NEXT_PUBLIC_CLINIC_EMAIL    ?? 'info@yourdomain.com'
  const wa       = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const mapsUrl  = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ?? '#'

  return (
    <>
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-2">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Contact Us</h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent w-24 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-16 pattern-light">
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
                { icon: Phone,         label: 'Phone', value: phone,        href: `tel:${phone}` },
                { icon: Mail,          label: 'Email', value: email,        href: `mailto:${email}` },
                { icon: MapPin,        label: 'Address', value: '123 Clinic Street, City, Postcode', href: mapsUrl },
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

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#e0d9cf]">
                <div className="w-9 h-9 bg-[#e6f4f4] rounded-full flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-[#1e5c5c]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Opening Hours</p>
                  <div className="text-sm text-[#1a4a4a] space-y-0.5">
                    <p>Monday – Friday: 9:00 am – 7:00 pm</p>
                    <p>Saturday: 9:00 am – 5:00 pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {wa && (
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent('Hello, I have an enquiry about hijama appointments.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                >
                  <MessageCircle size={16} />
                  Message Us on WhatsApp
                </a>
              )}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-[#e0d9cf] shadow-sm bg-[#e6f4f4] flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
              <MapPin size={40} className="text-[#2a8a8a] mb-3 opacity-50" />
              <p className="text-[#1a4a4a] font-semibold mb-2">123 Clinic Street, City</p>
              <p className="text-sm text-gray-500 mb-4">Add your Google Maps embed here</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm bg-[#1a4a4a] text-white px-4 py-2 rounded-md hover:bg-[#1e5c5c] transition-colors">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
