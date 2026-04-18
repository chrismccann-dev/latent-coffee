interface SectionCardProps {
  title?: string
  dark?: boolean
  children: React.ReactNode
}

export function SectionCard({ title, dark, children }: SectionCardProps) {
  return (
    <div className={`rounded-md p-6 mb-4 ${dark ? 'bg-latent-fg text-white' : 'bg-white border border-latent-border'}`}>
      {title && (
        <div className={`font-mono text-xxs font-semibold tracking-wide uppercase mb-4 ${dark ? 'opacity-60' : 'text-latent-mid'}`}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
