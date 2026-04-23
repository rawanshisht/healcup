'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const phone = process.env.NEXT_PUBLIC_CLINIC_PHONE ?? ''

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[--border] shadow-sm">
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="text-xl font-bold text-[--teal-800]" style={{ fontFamily: 'Georgia, serif' }}>
            {process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama'}
          </span>
          <span className="text-[10px] tracking-widest text-[--gold-600] uppercase">Cupping Therapy</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-150 ${
                isActive(l.href)
                  ? 'text-[#1e5c5c] bg-[#e6f4f4]'
                  : 'text-gray-600 hover:text-[#1e5c5c] hover:bg-[#e6f4f4] active:bg-[#cce9e9]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA + phone */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm text-[--teal-800] font-medium hover:text-[--teal-600] transition-colors">
              <Phone size={14} /> {phone}
            </a>
          )}
          <Link
            href="/book"
            className="bg-[--teal-800] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[--teal-700] transition-colors shadow-sm"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[#1a4a4a] rounded-md hover:bg-[#e6f4f4] active:bg-[#cce9e9] transition-all duration-150"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[--border] bg-white px-5 pb-5 pt-3 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2.5 px-3 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive(l.href)
                  ? 'text-[#1e5c5c] bg-[#e6f4f4]'
                  : 'text-gray-600 hover:text-[#1e5c5c] hover:bg-[#e6f4f4] active:bg-[#cce9e9]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="block bg-[--teal-800] text-white text-sm font-semibold px-4 py-2.5 rounded-md text-center hover:bg-[--teal-700] transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
