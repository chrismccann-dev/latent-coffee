import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Root route is a pure dispatcher (polish-audit Pass 3 — was a bare unstyled
// <a href="/login">): authed sessions land on the brews index, everyone else
// on the login form. No rendered surface of its own.
export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  redirect(user ? '/brews' : '/login')
}
