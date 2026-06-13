import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Off-white + green theme — primary brand is fresh organic green.
        primary: {
          DEFAULT: '#4BAF47', // fresh green (buttons, links, accents)
          dark: '#3C8C39',
          light: '#6BC267',
        },
        // `accent` is a deeper green so `hover:bg-accent` reads as a natural
        // button-hover (green → darker green).
        accent: {
          DEFAULT: '#3C8C39',
          dark: '#2F6E2D',
          light: '#4BAF47',
        },
        // Deeper forest green for variety (secondary cues, badges).
        secondary: {
          DEFAULT: '#2E6B2C',
          dark: '#1F4D1E',
          light: '#3C8C39',
        },
        // Warm amber accent — pairs with green (taglines, footer icons).
        amber: {
          DEFAULT: '#FDBB4B',
          dark: '#E0A93B',
          light: '#FFD27A',
        },
        // Off-white surfaces. `cream.DEFAULT` is the barely-off-white page bg;
        // dark/warm tints are subtle neutrals for borders, hovers, placeholders.
        cream: {
          DEFAULT: '#FAFAF5', // barely off-white page background
          dark: '#F2F1E9',
          warm: '#E4E2D7',
        },
        // Warm-neutral border token (used across components).
        tan: {
          DEFAULT: '#E4E2D7',
          dark: '#D6D2C5',
          light: '#F1EFE8',
        },
        // Text
        charcoal: '#1F1E17', // headings / dark text
        muted: '#5C5C52',    // body / secondary text
      },
      fontFamily: {
        // Maati: Manrope for headings + body, script for taglines
        heading: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        script: ['var(--font-grace)', '"Covered By Your Grace"', 'cursive'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        // Maati buttons use 10px rounded-rectangles
        'pill': '50px',
        'btn': '10px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(31, 30, 23, 0.06)',
        'card-hover': '0 12px 40px rgba(75, 175, 71, 0.16)',
        'sm-warm': '0 2px 8px rgba(75, 175, 71, 0.12)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
