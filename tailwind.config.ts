import type { Config } from 'tailwindcss';

/**
 * Token source of truth.
 *
 * Structure follows the COLLINS framework extracted from wearecollins.com:
 * serif display + grotesk secondary, off-white ground, near-black ink,
 * generous grid padding, one saturated signal colour.
 *
 * Every colour value below is sampled from the supplied Emerald logo SVG
 * package (emerald-spa-symbol-full-color.svg), not from COLLINS.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // Gate every hover: variant behind (hover: hover). On touch devices a
  // fired hover state sticks until the next tap, so image zooms and colour
  // shifts lingered after a scroll-tap. The animate skill's hard rule:
  // hover motion is for fine pointers only. Dropdowns and menus driven by
  // JavaScript state are unaffected.
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Ground and ink (COLLINS structure, Emerald values), defined as CSS
        // variables so the whole palette flips in dark theme (see :root and
        // prefers-color-scheme in globals.css). Values are RGB triplets for
        // Tailwind's <alpha-value> opacity support.
        ground: 'rgb(var(--c-ground) / <alpha-value>)',
        groundDeep: 'rgb(var(--c-ground-deep) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',

        // Emerald gemstone, sampled from the logo facets
        emerald: {
          50: 'rgb(var(--c-emerald-50) / <alpha-value>)',
          100: 'rgb(var(--c-emerald-100) / <alpha-value>)',
          300: 'rgb(var(--c-emerald-300) / <alpha-value>)',
          500: 'rgb(var(--c-emerald-500) / <alpha-value>)',
          600: 'rgb(var(--c-emerald-600) / <alpha-value>)',
          700: 'rgb(var(--c-emerald-700) / <alpha-value>)',
          800: 'rgb(var(--c-emerald-800) / <alpha-value>)',
          900: 'rgb(var(--c-emerald-900) / <alpha-value>)',
        },

        // Rose gold orbital rings, sampled from goldMetal / goldSoft gradients
        // The former clay palette was removed in Round 5: the site now reads
        // emerald + off-white + marble, with gold as its only warm accent.
        gold: {
          100: 'rgb(var(--c-gold-100) / <alpha-value>)',
          200: 'rgb(var(--c-gold-200) / <alpha-value>)',
          300: 'rgb(var(--c-gold-300) / <alpha-value>)',
          400: 'rgb(var(--c-gold-400) / <alpha-value>)',
          500: 'rgb(var(--c-gold-500) / <alpha-value>)',
          600: 'rgb(var(--c-gold-600) / <alpha-value>)',
          700: 'rgb(var(--c-gold-700) / <alpha-value>)',
          800: 'rgb(var(--c-gold-800) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        shell: '90rem',
      },
      // Full integer opacity scale (Tailwind v4 behaviour). The v3 default
      // scale only has multiples of 5, so any /6, /8, /12, /62, /92, /96
      // modifier silently generated NO CSS. That single gap shipped to
      // production and removed the background from the footer, the mobile
      // menu panel, the search overlay and the category strip (light text
      // on the white page behind them). Registering every step 0-100 makes
      // every alpha modifier valid now and forever.
      opacity: (() => {
        const steps: Record<string, string> = {};
        for (let i = 0; i <= 100; i++) steps[i] = `${i / 100}`;
        return steps;
      })(),
      transitionTimingFunction: {
        // COLLINS easing ladder, verified from their stylesheet
        'out-expo': 'cubic-bezier(.19,1,.22,1)',
        'out-quint': 'cubic-bezier(.23,1,.32,1)',
        'in-out-quart': 'cubic-bezier(.77,0,.175,1)',
        reveal: 'cubic-bezier(0.22,1,0.36,1)',
      },
    },
  },
  plugins: [],
};

export default config;
