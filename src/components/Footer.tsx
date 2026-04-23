import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Clock, CalendarCheck } from 'lucide-react'

export default function Footer() {
  const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'
  const phone      = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''
  const email      = process.env.NEXT_PUBLIC_CLINIC_EMAIL ?? ''

  return (
    <footer>
      {/* ── Pre-footer CTA strip ─────────────────────── */}
      <div className="bg-[#c9a84c]">
        <div className="container-site py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to begin your healing journey?
            </p>
            <p className="text-white/80 text-sm mt-1">
              Book online in under 3 minutes. Confirmation within a few hours.
            </p>
          </div>
          <Link
            href="/book"
            className="shrink-0 bg-white text-[#b8892a] font-bold text-sm px-8 py-3.5 rounded-md hover:bg-[#fdf6e3] transition-colors shadow-sm flex items-center gap-2"
          >
            <CalendarCheck size={16} />
            Book an Appointment
          </Link>
        </div>
      </div>

      {/* ── Main footer body ─────────────────────────── */}
      <div className="pattern-bg text-white">
        {/* Gold top line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

        <div className="container-site py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {clinicName}
            </h3>
            <p className="text-[#c9a84c] text-[9px] tracking-[0.3em] uppercase font-semibold mb-5">
              Cupping Therapy
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Healing through the Sunnah — professional hijama therapy in a safe, hygienic, and spiritually mindful environment.
            </p>
            <blockquote className="border-l-2 border-[#c9a84c] pl-4">
              <p className="text-[#d4b96a] text-sm italic leading-relaxed">
                &ldquo;The best of your treatments is hijama.&rdquo;
              </p>
              <cite className="block text-white/35 text-xs not-italic mt-1.5">
                — Sahih al-Bukhari 5371
              </cite>
            </blockquote>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[#c9a84c] uppercase text-[10px] tracking-[0.25em] font-semibold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                ['/services',     'Our Services'],
                ['/how-it-works', 'How It Works'],
                ['/book',         'Book Appointment'],
                ['/about',        'About Us'],
                ['/faq',          'FAQ'],
                ['/contact',      'Contact Us'],
                ['/privacy',      'Privacy & Terms'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-[#d4b96a] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#c9a84c] uppercase text-[10px] tracking-[0.25em] font-semibold mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#c9a84c]/20 transition-colors">
                      <Phone size={13} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-white/70 text-sm group-hover:text-white transition-colors">{phone}</p>
                    </div>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#c9a84c]/20 transition-colors">
                      <Mail size={13} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-white/70 text-sm group-hover:text-white transition-colors">{email}</p>
                    </div>
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">Address</p>
                  <p className="text-white/60 text-sm">123 Clinic Street<br />City, Postcode</p>
                </div>
              </li>
            </ul>

            <div className="flex gap-2.5 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            <h4 className="text-[#c9a84c] uppercase text-[10px] tracking-[0.25em] font-semibold mb-5">
              Opening Hours
            </h4>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={13} className="text-[#c9a84c]" />
              </div>
              <ul className="text-sm space-y-2.5">
                {[
                  { day: 'Monday – Friday', hours: '9:00 am – 7:00 pm' },
                  { day: 'Saturday',        hours: '9:00 am – 5:00 pm' },
                  { day: 'Sunday',          hours: 'Closed' },
                ].map(({ day, hours }) => (
                  <li key={day}>
                    <p className="text-white/35 text-[10px] uppercase tracking-wider">{day}</p>
                    <p className={`text-sm font-medium ${hours === 'Closed' ? 'text-white/35' : 'text-white/70'}`}>
                      {hours}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-3.5">
              <p className="text-white/50 text-xs leading-relaxed">
                Appointments confirmed by WhatsApp or email, usually within a few hours of booking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6">
          <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <p>© {new Date().getFullYear()} {clinicName}. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-white/55 transition-colors">
              Privacy &amp; Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
