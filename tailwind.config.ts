import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Latent Coffee brand colors
        'latent': {
          fg: '#1a1a1a',
          bg: '#FAFAFA',
          mid: '#888',
          subtle: '#bbb',
          border: '#e5e5e5',
          accent: '#2C3E2D',      // Dark green for coffee imagery
          'accent-light': '#4A7C59',
          highlight: '#f8fff0',   // Light green highlight
          'highlight-border': '#c5e1a8',
          // Sub Pages 6.4 (2026-05-13) — temporal-salience tokens per
          // docs/roasting/redesign.md § 5.5. Named by meaning, not by color
          // value, so the underlying palette can shift without a rename.
          // Pairing convention: `bg-latent-X-emphasis-surface border border-latent-X-emphasis`
          // for a colored card, or `text-latent-X-emphasis` for accent text inside neutral cards.
          'cup-emphasis': '#6B4D75',             // cupping-related: updated predictions, taste-for, reference signals
          'cup-emphasis-surface': '#F4EDF3',
          'roast-emphasis': '#8B5E1F',           // roast-related: drop rules, varying design levers, delta callouts
          'roast-emphasis-surface': '#F8EFE0',
          'resolved-emphasis': '#2C3E2D',        // resolved lots / "why this roast won" / reference-roast surface (6.5)
          'resolved-emphasis-surface': '#F8FFF0',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'chip': ['0.5rem', { lineHeight: '1' }],        // 8px — strategy pill short-form, book-cover meta
        'micro': ['0.5625rem', { lineHeight: '1.4' }],  // 9px — strategy pill row, brew-cover flavor line
        'xxs': '0.65rem',                                // 10.4px — labels, tags, badges, footer
        'xs': '0.72rem',                                 // 11.5px — nav, buttons, small chrome
      },
      letterSpacing: {
        'widest': '0.15em',
        'wide': '0.1em',
      },
    },
  },
  plugins: [],
}
export default config
