/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0F0B24',
          deep: '#09061A',
          soft: '#1D1238',
          glow: '#7B5CFF',
        },
        mist: '#16122E',
        blush: '#0F0B24',
        ink: '#F4F0FF',
        pink: {
          DEFAULT: '#FF4F7B',
          soft: '#FF8FAD',
          deep: '#E63D68',
        },
        coral: {
          DEFAULT: '#FF4F7B',
          deep: '#E63D68',
        },
        violet: {
          DEFAULT: '#7B5CFF',
          soft: '#A894FF',
          deep: '#5E3FE0',
        },
        lilac: '#A894FF',
        teal: {
          DEFAULT: '#2EE6A6',
          deep: '#1BC48A',
        },
        sky: '#7CC6FE',
        gold: '#FFC857',
        primary: '#0F0B24',
        secondary: '#1D1238',
        accent: '#7B5CFF',
        sunrise: '#FF4F7B',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'soft-pulse': 'soft-pulse 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
}
