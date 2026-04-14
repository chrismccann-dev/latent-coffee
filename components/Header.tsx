'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'BREWS', href: '/brews' },
  { label: 'TERROIRS', href: '/terroirs' },
  { label: 'CULTIVARS', href: '/cultivars' },
  { label: 'GREEN', href: '/green' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-latent-bg border-b border-latent-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/brews" className="font-mono font-bold text-lg tracking-widest uppercase">
          LATENT
          <span className="font-light text-latent-mid ml-1.5 text-xs tracking-wide">
            RESEARCH
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-7">
          {navItems.map(({ label, href }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`font-mono text-xs tracking-wide transition-colors ${
                  isActive 
                    ? 'font-semibold text-latent-fg' 
                    : 'font-medium text-latent-mid hover:text-latent-fg'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/add" className="btn btn-primary py-2 text-xs">
            + ADD
          </Link>
          <button 
            onClick={handleLogout}
            className="font-mono text-xxs text-latent-mid hover:text-latent-fg transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
