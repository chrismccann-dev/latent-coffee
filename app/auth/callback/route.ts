import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Only accept same-origin path-style `next` values. Blocks absolute URLs,
// protocol-relative `//host`, and userinfo tricks like `@evil.com` /`.evil.com`
// that would otherwise make `${origin}${next}` resolve off-site (remediation #5,
// mirrors safeNext() on the login page).
function safeNext(raw: string | null): string {
  if (!raw) return '/brews'
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/brews'
  return raw
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
