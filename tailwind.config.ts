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
        primary: {
          DEFAULT: '#65371B',
          dark: '#4E2A12',
          light: '#7D4422',
        },
        secondary: {
          DEFAULT: '#2E3E27',
          dark: '#1E2E18',
          light: '#3E5035',
        },
        cream: {
          DEFAULT: '#F1F2E2',
          dark: '#E6E7D5',
          warm: '#E9D1BF',
        },
        tan: {
          DEFAULT: '#E9D1BF',
          dark: '#D4B8A0',
          light: '#F5E8DC',
        },
        charcoal: '#222222',
        muted: '#666666',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'pill': '50px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
        'sm-warm': '0 2px 8px rgba(101, 55, 27, 0.12)',
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
