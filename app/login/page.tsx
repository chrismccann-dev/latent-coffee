'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Only accept same-origin path-style next values (e.g. /api/mcp/authorize?...).
// Blocks absolute URLs, protocol-relative URLs, and anything that could redirect
// off-site. Used by Sprint 3.0's OAuth /authorize endpoint when an unauthenticated
// session needs to log in mid-flow.
function safeNext(raw: string | null): string {
  if (!raw) return '/brews'
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/brews'
  return raw
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get('next'))
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-latent-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="font-mono font-bold text-lg tracking-widest uppercase">
            LATENT
            <span className="font-light text-latent-mid ml-1.5 text-xs tracking-wide">
              RESEARCH
            </span>
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-sans text-2xl font-semibold mb-8 text-center">
            Log in
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-latent-mid">
            Don't have an account?{' '}
            <Link href="/signup" className="text-latent-fg hover:text-latent-accent-light">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
