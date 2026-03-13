'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    const res = await signIn('credentials', {
      username, password, redirect: false,
    })
    if (res?.ok) {
      router.push('/admin')
    } else {
      setError('Invalid username or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e0d9cf] shadow-sm overflow-hidden">
        <div className="bg-[#1a4a4a] px-6 py-8 text-center">
          <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-1">Admin Panel</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a4a4a] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#e0d9cf] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#237070]"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a4a4a] hover:bg-[#1e5c5c] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
