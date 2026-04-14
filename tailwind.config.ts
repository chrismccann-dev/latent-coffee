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
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.65rem',
        'xs': '0.72rem',
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
