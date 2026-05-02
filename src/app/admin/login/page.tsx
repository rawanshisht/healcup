'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { username, password, redirect: false })
    if (res?.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect username or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header card */}
        <div className="bg-[#1a4a4a] rounded-2xl px-8 py-8 text-center mb-0 rounded-b-none">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-[#c9a84c]" />
          </div>
          <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase font-semibold mb-1">
            Admin Panel
          </p>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama'}
          </h1>
          <p className="text-white/45 text-xs mt-1.5">Sign in to manage appointments and services</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl rounded-t-none border border-[#e0d9cf] border-t-0 shadow-md px-8 py-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1a4a4a] uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070] bg-[#faf7f2]"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1a4a4a] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-[#e0d9cf] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070] bg-[#faf7f2]"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
                <span className="text-red-500 text-xs font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a4a4a] hover:bg-[#1e5c5c] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
