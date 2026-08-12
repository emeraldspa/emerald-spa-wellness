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
  theme: {
    extend: {
      colors: {
        // Ground and ink (COLLINS structure, Emerald values)
        ground: '#F7F5F1',
        ink: '#07211A',

        // Emerald gemstone, sampled from the logo facets
        emerald: {
          50: '#EAF6F1',
          100: '#C7E9DA',
          300: '#75E0BA',
          500: '#087452',
          600: '#0A5A45',
          700: '#07503D',
          800: '#063F31',
          900: '#063D2F',
        },

        // Rose gold orbital rings, sampled from goldMetal / goldSoft gradients
        gold: {
          100: '#FFF0A4',
          200: '#FFE18A',
          300: '#F2C35E',
          400: '#F1C35D',
          500: '#C77B36',
          600: '#A75D31',
          700: '#7B3D20',
          800: '#7A3B20',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        shell: '90rem',
      },
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
