'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const links = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/services',     label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq',          label: 'FAQ' },
  { href: '/contact',      label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const phone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[--border] shadow-sm">
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-xl font-bold text-[--teal-800]" style={{ fontFamily: 'Georgia, serif' }}>
            {process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama'}
          </span>
          <span className="text-[10px] tracking-widest text-[--gold-600] uppercase">Cupping Therapy</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700 hover:text-[--teal-700] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA + phone */}
        <div className="hidden md:flex items-center gap-3">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm text-[--teal-800] font-medium">
              <Phone size={14} /> {phone}
            </a>
          )}
          <Link
            href="/book"
            className="bg-[--teal-800] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[--teal-700] transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-[--teal-800]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[--border] bg-white px-5 pb-5 pt-3 space-y-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-1.5 text-sm font-medium text-gray-700 hover:text-[--teal-700]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="block mt-2 bg-[--teal-800] text-white text-sm font-semibold px-4 py-2.5 rounded-md text-center"
          >
            Book an Appointment
          </Link>
        </div>
      )}
    </header>
  )
}
