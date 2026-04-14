'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
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

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-latent-highlight border border-latent-highlight-border rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="font-sans text-2xl font-semibold mb-4">
              Check your email
            </h1>
            <p className="text-latent-mid">
              We've sent a confirmation link to <strong>{email}</strong>. 
              Click the link to activate your account.
            </p>
          </div>
        </main>
      </div>
    )
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
            Create account
          </h1>

          <form onSubmit={handleSignup} className="space-y-4">
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

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-latent-mid">
            Already have an account?{' '}
            <Link href="/login" className="text-latent-fg hover:text-latent-accent-light">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
