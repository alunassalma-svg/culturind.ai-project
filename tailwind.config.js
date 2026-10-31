/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#3d6970',
          pink: '#86445b',
          green: '#4b6b45',
          purple: '#735f91',
          yellow: '#805e28',
          orange: '#a25938',
        },
        batik: {
          50: '#FFF8F0',
          100: '#FFE8D1',
          200: '#FFD0A3',
          300: '#FFB366',
          400: '#edc86d',
          500: '#bd9145',
          600: '#8e672b',
          700: '#79572b',
          800: '#59452f',
          900: '#382e23',
        },
        ink: {
          50: '#382e23',
          100: '#413828',
          200: '#544534',
          300: '#6a5947',
          400: '#655542',
          500: '#786953',
          600: '#d7c9b5',
          700: '#ebe3d4',
          800: '#f5f0e7',
          900: '#fffaf0',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
