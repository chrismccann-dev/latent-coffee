'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'BREWS', href: '/brews' },
  { label: 'TERROIRS', href: '/terroirs' },
  { label: 'CULTIVARS', href: '/cultivars' },
  { label: 'PROCESSES', href: '/processes' },
  { label: 'ROASTERS', href: '/roasters' },
  { label: 'GREEN', href: '/green' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-latent-bg border-b border-latent-border">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/brews" className="font-mono font-bold text-lg tracking-widest uppercase flex-shrink-0">
          LATENT
          <span className="font-light text-latent-mid ml-1.5 text-xs tracking-wide">
            RESEARCH
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs tracking-wide transition-colors ${
                isActive(href)
                  ? 'font-semibold text-latent-fg'
                  : 'font-medium text-latent-mid hover:text-latent-fg'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/add" className="btn btn-primary py-2 text-xs">
            + ADD
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded border border-latent-border text-latent-fg"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M2 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-latent-border bg-latent-bg"
        >
          <div className="max-w-[1200px] mx-auto px-6 py-2 flex flex-col">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-mono text-xs tracking-wide py-3 border-b border-latent-border last:border-b-0 ${
                  isActive(href)
                    ? 'font-semibold text-latent-fg'
                    : 'font-medium text-latent-mid'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
