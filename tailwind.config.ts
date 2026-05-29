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
        // Latent Coffee design tokens.
        // Redesign Sprint 0 (2026-05-29): re-pointed to the v2 "warm paper" design
        // system (claude.ai/design). Token NAMES stay `latent-*` so all existing
        // JSX is untouched; only values change + new families are added. v2's CSS-var
        // names (--acc-*, --tile-*, etc.) live in app/globals.css `:root` and back the
        // `.ssp-*` primitive family + let pasted prototype CSS resolve.
        'latent': {
          // Neutrals (warm paper)
          fg: '#0E0E0E',          // near-black ink
          bg: '#F2F1EC',          // warm paper background
          mid: '#6B6B66',         // muted label/meta text
          subtle: '#B4B4AE',      // faint text / disabled
          border: '#E0DFDA',      // standard card/section border
          paper: '#FAFAF7',       // tinted card surface (lighter than bg)
          surface: '#FFFFFF',     // pure-white surface (grids, tables)
          hairline: '#EDEBE5',    // hairline dividers inside cards
          // Chrome greens (btn-primary hover, sage chip treatment)
          accent: '#2c4a35',                     // dark green — btn-primary hover / focus
          'accent-light': '#4A7C59',             // sage
          highlight: '#EDF3EC',                  // sage-tint chip / row highlight
          'highlight-border': '#C9DBC4',
          // Temporal-salience / semantic-chrome tokens. Named by meaning, not color,
          // so the palette can shift without a rename. Pairing convention:
          // `bg-latent-X-emphasis-surface border border-latent-X-emphasis-br` for a card,
          // `text-latent-X-emphasis` for accent text inside a neutral card.
          // Redesign Sprint 0: amber / lavender / green roles re-derived from v2;
          // `-br` border variants added; `archive-emphasis` is the new 4th role.
          'roast-emphasis': '#A88037',           // amber — design intent, drop rules, predictions
          'roast-emphasis-surface': '#F4ECDC',
          'roast-emphasis-br': '#DEC9A0',
          'cup-emphasis': '#7A6E9E',             // lavender — cupping hypothesis, reference signals
          'cup-emphasis-surface': '#EDEAF4',
          'cup-emphasis-br': '#CFC8E1',
          'resolved-emphasis': '#4A7C59',        // green — resolved lots, reference roast, peak expression
          'resolved-emphasis-surface': '#EDF3EC',
          'resolved-emphasis-br': '#C9DBC4',
          'archive-emphasis': '#6B6B66',         // neutral-grey — archive / read-once provenance (new role)
          'archive-emphasis-surface': '#EAE9E4',
          'archive-emphasis-br': '#C8C7C2',
          // Flavor accents — labels / chips / dots / swatches only (NOT chrome).
          'acc-green': '#5B8A5A',  'acc-green-bg': '#EEF3EC',  'acc-green-br': '#C9DBC4',
          'acc-coral': '#C77A5C',  'acc-coral-bg': '#F6EDE6',  'acc-coral-br': '#E8CFBE',
          'acc-teal': '#5C8A8C',   'acc-teal-bg': '#E8F0F0',   'acc-teal-br': '#C5D7D8',
          'acc-amber': '#A88037',  'acc-amber-bg': '#F4ECDC',  'acc-amber-br': '#DEC9A0',
          'acc-plum': '#8E5A6E',   'acc-plum-bg': '#F2E8EC',   'acc-plum-br': '#D8BFCB',
          // Lifecycle tiles — green-coffee → roasted-coffee gradient across the 4 states.
          // Resolved goes roasted-brown per redesign ratification #5 (was near-black `fg`).
          'tile-inventory': '#B4B4AE',     // grey — held back, hidden from primary view
          'tile-next-roast': '#4A7C59',    // sage green — green bean, ready to roast
          'tile-next-cupping': '#6B5E3A',  // olive-bronze — between roast and cupping
          'tile-resolved': '#3a2418',      // roasted brown — finished bean
          // Name-plate hero edge (Ssp* primitive family)
          'hero-plum': '#7A3B5C',
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
        // Redesign Sprint 0: v2 body is 13px (down from 14px); hero h1 is 22px (down
        // from the Tailwind-default 24px). lg/xl unchanged from defaults (18/20px).
        'sm': ['0.8125rem', { lineHeight: '1.55' }],     // 13px — body text (v2)
        'lg': ['1.125rem', { lineHeight: '1.3' }],       // 18px — card titles (mono per ratification #2)
        'xl': ['1.25rem', { lineHeight: '1.25' }],       // 20px
        '2xl': ['1.375rem', { lineHeight: '1.2' }],      // 22px — detail-page hero h1 (sans)
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
