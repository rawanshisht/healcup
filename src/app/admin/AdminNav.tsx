'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Calendar, Settings, LogOut, List } from 'lucide-react'

export default function AdminNav() {
  return (
    <header className="bg-[#1a4a4a] text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-[#c9a84c] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          Admin Panel
        </span>
        <nav className="flex gap-4">
          {[
            { href: '/admin',              label: 'Appointments', icon: List },
            { href: '/admin/services',     label: 'Services',     icon: Settings },
            { href: '/admin/blocked-dates',label: 'Blocked Dates',icon: Calendar },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
              <Icon size={13} /> {label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
      >
        <LogOut size={13} /> Sign Out
      </button>
    </header>
  )
}
