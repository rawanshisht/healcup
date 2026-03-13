import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'
  const phone      = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''
  const email      = process.env.NEXT_PUBLIC_CLINIC_EMAIL ?? ''

  return (
    <footer className="pattern-bg text-white mt-0">
      {/* Gold top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[--gold-500] to-transparent" />

      <div className="container-site py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{clinicName}</h3>
          <p className="text-[--gold-400] text-xs tracking-widest uppercase mb-4">Cupping Therapy</p>
          <p className="text-white/70 text-sm leading-relaxed">
            Healing through the Sunnah — professional hijama therapy in a safe, caring environment.
          </p>
          <p className="mt-4 text-[--gold-400] text-sm italic">
            &ldquo;Make use of the two cures: honey and the Quran.&rdquo;
            <span className="block not-italic text-white/50 text-xs mt-1">— Ibn Majah</span>
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-[--gold-400] uppercase text-xs tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            {[
              ['/services',     'Our Services'],
              ['/how-it-works', 'How It Works'],
              ['/book',         'Book Appointment'],
              ['/faq',          'FAQ'],
              ['/contact',      'Contact Us'],
              ['/privacy',      'Privacy & Terms'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-[--gold-400] transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-[--gold-400] uppercase text-xs tracking-widest mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-white/80">
            {phone && (
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[--gold-500] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[--gold-500] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-[--gold-500] shrink-0 mt-0.5" />
              <span>123 Clinic Street, City, Postcode</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[--gold-500] hover:text-[--gold-400] transition-colors">
              <Instagram size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-white/40 text-xs">
          © {new Date().getFullYear()} {clinicName}. All rights reserved.
          {' · '}
          <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy & Terms</Link>
        </p>
      </div>
    </footer>
  )
}
