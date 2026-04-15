import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Latent Coffee Research',
  description: 'Personal coffee research journal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-latent-bg text-latent-fg antialiased">
        {children}
      </body>
    </html>
  )
}
