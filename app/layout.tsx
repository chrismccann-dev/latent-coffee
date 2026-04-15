import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-latent-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <div className="font-mono text-xxs text-latent-mid">
            LATENT RESEARCH
          </div>
          <div className="flex gap-6">
            <button className="font-mono text-xxs text-latent-mid hover:text-latent-fg transition-colors uppercase tracking-wide">
              IMPORT
            </button>
            <button className="font-mono text-xxs text-latent-mid hover:text-latent-fg transition-colors uppercase tracking-wide">
              EXPORT
            </button>
          </div>
          <div className="font-mono text-xxs text-latent-subtle">
            Personal Coffee Journal
          </div>
        </div>
      </footer>
    </div>
  )
}
