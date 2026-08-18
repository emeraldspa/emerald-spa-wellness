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
        // Ground is deliberately off-white and slightly warm. Pure white and
        // near-white both read as flat on screen, so the base carries a little
        // stone colour and the paper grain overlay does the rest.
        ground: '#F2EFE8',
        groundDeep: '#EBE7DE',
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
        /*
          Warm neutrals sampled from the venue's own photographs: the terracotta
          armchairs in the waiting room, the amber cushions, the clay pots in
          the garden. They exist so the site is not only emerald and off-white,
          and they are used as accents and grounds rather than as new brand
          colours.
        */
        clay: {
          50: '#FAF3EC',
          100: '#F3E4D6',
          200: '#E7C8AE',
          300: '#D9A57F',
          400: '#C97F4F',
          500: '#B35F33',
          600: '#8F4826',
          700: '#6B351C',
        },
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
