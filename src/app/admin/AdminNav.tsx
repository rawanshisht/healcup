'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Calendar, Settings, LogOut, List, FileText, Package, ShoppingBag } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Appointments', icon: List },
  { href: '/admin/services', label: 'Services', icon: Settings },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/blocked-dates', label: 'Blocked Dates', icon: Calendar },
  { href: '/admin/content', label: 'Content', icon: FileText },
]

export default function AdminNav() {
  return (
    <header className="bg-[#1a4a4a] text-white  mb-2">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-[#c9a84c] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          Admin Panel
        </span>
        <nav className="hidden sm:flex gap-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <Icon size={13} /> {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
      <div className="sm:hidden border-t border-white/10 px-4 py-2 flex justify-around">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
            <Icon size={13} /> {label}
          </Link>
        ))}
      </div>
    </header>
  )
}
