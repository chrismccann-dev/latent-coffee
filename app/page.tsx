import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If logged in, redirect to brews
  if (user) {
    redirect('/brews')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-latent-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-mono font-bold text-lg tracking-widest uppercase">
            LATENT
            <span className="font-light text-latent-mid ml-1.5 text-xs tracking-wide">
              RESEARCH
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="font-mono text-xs tracking-wide hover:text-latent-accent-light transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="btn btn-primary text-xs py-2"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="w-20 h-20 bg-latent-accent rounded-lg mx-auto mb-8 flex items-center justify-center">
            <span className="text-3xl">🌱</span>
          </div>
          
          <h1 className="font-sans text-4xl font-semibold mb-4">
            Coffee Research Journal
          </h1>
          
          <p className="text-latent-mid text-lg mb-8 leading-relaxed">
            Track your green bean sourcing, roasting experiments, and brew documentation. 
            Build knowledge about terroirs and cultivars over time.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Log In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-left">
            <div>
              <div className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid mb-2">
                Green Beans
              </div>
              <p className="text-sm text-latent-mid">
                Track lots, roast logs, experiments, and learnings for each green bean you source.
              </p>
            </div>
            <div>
              <div className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid mb-2">
                Terroir & Cultivar
              </div>
              <p className="text-sm text-latent-mid">
                Build a knowledge base of how origins and varieties express in the cup.
              </p>
            </div>
            <div>
              <div className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid mb-2">
                Brew Documents
              </div>
              <p className="text-sm text-latent-mid">
                Capture recipes, sensory notes, and extraction learnings for reference.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-latent-border py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="font-mono text-xxs text-latent-mid">
            LATENT RESEARCH
          </div>
          <div className="font-mono text-xxs text-latent-subtle">
            Personal Coffee Journal
          </div>
        </div>
      </footer>
    </div>
  )
}
