import type { Config } from "tailwindcss";

/**
 * GGBingo CRM design system — light cobalt.
 *
 * Every colour below comes from the approved redesign. There is deliberately no
 * dark surface in the palette: the whole product runs on white / #F8F9FB cards
 * over an #F3F4F6 page, with cobalt as the single accent.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cobalt accent. 600 is the primary, 700 the hover, 800 the heading ink.
        brand: {
          50: '#EEF2FE',
          100: '#DFE7FD',
          200: '#C7D5FB',
          300: '#E8ECFB',
          400: '#6E8AE8',
          500: '#4471EA',
          600: '#2E5CE6',
          700: '#2450CC',
          800: '#1D46C4',
          900: '#16358F',
        },
        // Text ramp.
        ink: {
          900: '#16181D',
          700: '#3A414E',
          500: '#667085',
          400: '#98A2B3',
          300: '#AEB4C0',
        },
        // Borders and dividers.
        line: {
          DEFAULT: '#E4E7EC',
          soft: '#F0F1F4',
          softer: '#EDEFF3',
          muted: '#D3D7DF',
          strong: '#C9CED8',
        },
        // Surfaces.
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8F9FB',
          page: '#F3F4F6',
        },
        // Status pairs — `bg` for the chip fill, `fg` for its text.
        success: { bg: '#EEF4EE', fg: '#1F7A33', border: '#D3E4D3', hover: '#DFECDF', dot: '#2FA84F', deep: '#186329' },
        warn: { bg: '#FDF3E7', fg: '#B25E09' },
        danger: { bg: '#FDEEEE', fg: '#C22F35', border: '#F3C4C6', hover: '#FADCDD', dot: '#E5484D' },
        // Named `plum`/`aqua` rather than `violet`/`cyan` so they extend the
        // Tailwind palette instead of replacing those built-in scales, which
        // the rest of the app still uses.
        plum: { bg: '#F4F1FE', fg: '#6D3FD4', border: '#E2D9FB', deep: '#7C3AED' },
        aqua: { bg: '#E4F6F8', fg: '#0E7490' },
        gold: { bg: '#FBF3D9', fg: '#8F6B08', border: '#EFDFA8' },
        steel: { bg: '#EEF0F4', fg: '#5B657F' },
        // Marketplace chips.
        shopee: { bg: '#FDEBE5', fg: '#D14415' },
        tiktok: { bg: '#F0F1F4', fg: '#16181D' },
        lazada: { bg: '#E8ECFB', fg: '#1D3EA8' },
        amazon: { bg: '#FDF3E7', fg: '#B25E09' },
        ggbingo: { bg: '#E4F6F8', fg: '#0E7490' },
        // The 7 pipeline stages, in order.
        stage: {
          1: '#2E5CE6',
          2: '#7C3AED',
          3: '#0891B2',
          4: '#D97706',
          5: '#059669',
          6: '#DB2777',
          7: '#64748B',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.35' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .35s ease',
        fadeUpFast: 'fadeUp .25s ease',
        softPulse: 'softPulse 2s infinite',
      },
      boxShadow: {
        card: '0 6px 18px -8px rgba(15,23,42,.15)',
        cardLg: '0 8px 22px -10px rgba(15,23,42,.18)',
        drag: '0 6px 16px -8px rgba(15,23,42,.25)',
        drawer: '-16px 0 40px -20px rgba(11,16,32,.5)',
        toast: '0 12px 30px -10px rgba(11,16,32,.6)',
      },
    },
  },
  plugins: [],
};
export default config;
