'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-latent-surface border-b border-latent-border">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center">
        {/* Logo */}
        <Link href="/brews" className="font-mono font-bold text-sm tracking-wide uppercase flex-shrink-0">
          LATENT
          <span className="font-light text-latent-mid ml-1.5 text-xxs tracking-wide">
            RESEARCH
          </span>
        </Link>

        {/* Desktop navigation — centered destinations (v2 nav-v2 shape).
            Chrome @media exception (grilling-queue 52, ratified 2026-06-11):
            viewport chrome can't use container queries by construction, so the
            header collapses via Tailwind @media — at lg: (1024) to honor the
            two-point 390/1024 model. Tablets 768-1023 get the hamburger. */}
        <nav className="hidden lg:flex flex-1 items-center justify-center flex-wrap gap-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                isActive(href)
                  ? 'font-semibold text-latent-fg'
                  : 'font-medium text-latent-mid hover:text-latent-fg'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Invisible tail spacer — balances the logo so the nav cluster is truly centered */}
        <div className="hidden lg:block w-36 flex-shrink-0" aria-hidden="true" />

        {/* Mobile: push hamburger to the right */}
        <div className="flex-1 lg:hidden" />
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded border border-latent-border text-latent-fg flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

      {/* Mobile sheet */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden border-t border-latent-border bg-latent-surface"
        >
          <div className="max-w-[1200px] mx-auto px-6 py-2 flex flex-col">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-mono text-xs tracking-widest uppercase py-3 border-b border-latent-border last:border-b-0 ${
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
