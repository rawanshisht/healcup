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
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e3db] shadow-sm">
      <div className="container-site flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none shrink-0 group">
          <span
            className="text-[1.2rem] font-bold text-[#1a4a4a] tracking-tight group-hover:text-[#1e5c5c] transition-colors"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama'}
          </span>
          <span className="text-[9px] tracking-[0.25em] text-[#b8892a] uppercase mt-0.5 font-medium">
            Cupping Therapy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium px-3.5 py-2 transition-colors rounded-md
                ${isActive(l.href)
                  ? 'text-[#1a4a4a]'
                  : 'text-gray-500 hover:text-[#1a4a4a]'
                }`}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#1a4a4a] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA + phone */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-sm text-[#1a4a4a] font-medium hover:text-[#237070] transition-colors"
            >
              <Phone size={14} className="text-[#237070]" />
              {phone}
            </a>
          )}
          <Link
            href="/book"
            className="bg-[#c9a84c] hover:bg-[#b8892a] text-white text-sm font-bold px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-[#1a4a4a] rounded-md hover:bg-[#f0f9f9] active:bg-[#e6f4f4] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-[#e8e3db] bg-white px-4 pb-4 pt-2 space-y-0.5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center py-2.5 px-3 rounded-md text-sm font-medium transition-colors
                ${isActive(l.href)
                  ? 'text-[#1a4a4a] bg-[#f0f9f9] border-l-2 border-[#1a4a4a]'
                  : 'text-gray-600 hover:text-[#1a4a4a] hover:bg-[#f0f9f9]'
                }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium text-[#1a4a4a] border border-[#e8e3db] hover:bg-[#f0f9f9] transition-colors"
              >
                <Phone size={14} className="text-[#237070]" /> {phone}
              </a>
            )}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="block bg-[#c9a84c] hover:bg-[#b8892a] text-white text-sm font-bold px-4 py-3 rounded-md text-center transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
