/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#f0f4ff', 100: '#dbe4ff', 200: '#bac8ff', 300: '#91a7ff', 400: '#748ffc', 500: '#5c7cfa', 600: '#4c6ef5', 700: '#4263eb', 800: '#3b5bdb', 900: '#364fc7' },
        accent: { 50: '#fff0f6', 100: '#ffd6e7', 200: '#faa2c1', 300: '#f783ac', 400: '#f06595', 500: '#e64980', 600: '#d6336c', 700: '#c2255c', 800: '#a61e4d', 900: '#8c1941' },
        neon: { cyan: '#00f5ff', purple: '#bf5af2', pink: '#ff2d55', green: '#30d158', orange: '#ff9f0a', blue: '#0a84ff' },
        glass: { white: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.87)' },
        dark: { 900: '#0a0a0f', 800: '#12121a', 700: '#1a1a25', 600: '#222233', 500: '#2a2a3d' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(92,124,250,0.3)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 40px rgba(92,124,250,0.6)' },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4)',
        'neon-blue': '0 0 20px rgba(10, 132, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(191, 90, 242, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 45, 85, 0.5)',
        'neon-green': '0 0 20px rgba(48, 209, 88, 0.5)',
      },
    },
  },
  plugins: [],
};
