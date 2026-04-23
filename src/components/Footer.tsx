import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'
  const phone      = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''
  const email      = process.env.NEXT_PUBLIC_CLINIC_EMAIL ?? ''

  return (
    <footer className="bg-[#1a4a4a] text-white">
      {/* Gold top border */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="container-site py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-1 text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {clinicName}
          </h3>
          <p className="text-[#c9a84c] text-[9px] tracking-[0.25em] uppercase mb-5 font-medium">
            Cupping Therapy
          </p>
          <p className="text-white/65 text-sm leading-relaxed">
            Healing through the Sunnah — professional hijama therapy in a safe, caring environment.
          </p>
          <blockquote className="mt-5 border-l-2 border-[#c9a84c] pl-3">
            <p className="text-[#d4b96a] text-sm italic leading-relaxed">
              &ldquo;Make use of the two cures: honey and the Quran.&rdquo;
            </p>
            <cite className="block text-white/40 text-xs not-italic mt-1">— Ibn Majah</cite>
          </blockquote>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-[#c9a84c] uppercase text-[10px] tracking-[0.2em] mb-5">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              ['/services',     'Our Services'],
              ['/how-it-works', 'How It Works'],
              ['/book',         'Book Appointment'],
              ['/faq',          'FAQ'],
              ['/contact',      'Contact Us'],
              ['/privacy',      'Privacy & Terms'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-white/65 hover:text-[#d4b96a] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-[#c9a84c] uppercase text-[10px] tracking-[0.2em] mb-5">
            Get in Touch
          </h4>
          <ul className="space-y-3.5 text-sm">
            {phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#c9a84c] shrink-0" />
                <a href={`tel:${phone}`} className="text-white/65 hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#c9a84c] shrink-0" />
                <a href={`mailto:${email}`} className="text-white/65 hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-[#c9a84c] shrink-0 mt-0.5" />
              <span className="text-white/65">123 Clinic Street, City, Postcode</span>
            </li>
          </ul>

          <div className="flex gap-3 mt-6">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-white/35 text-xs">
          © {new Date().getFullYear()} {clinicName}. All rights reserved.
          {' · '}
          <Link href="/privacy" className="hover:text-white/60 transition-colors">
            Privacy &amp; Terms
          </Link>
        </p>
      </div>
    </footer>
  )
}
