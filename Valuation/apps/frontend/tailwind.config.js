/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        lg: '1180px',
        xl: '1180px',
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        primary: { DEFAULT: '#0033A0', light: '#007BFF', dark: '#001A50' },
        accent: { DEFAULT: '#00CFFF', light: '#00E4FF', glow: '#00C6FF' },
        neutral: { white: '#FFFFFF', offwhite: '#F8FAFF', gray: '#334155', soft: '#CBD5E1' },
        success: '#00D97E',
        error: '#F87171',
      },
      boxShadow: {
        blue: '0 8px 25px rgba(0, 140, 255, 0.15)',
        deep: '0 20px 60px rgba(0, 128, 255, 0.25)',
      },
      borderRadius: { '2xl': '20px' },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #002B7F 0%, #007BFF 45%, #00CFFF 100%)',
        'gradient-accent': 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
        'gradient-dark': 'radial-gradient(ellipse at 30% 30%, #0033A0 0%, #001A50 50%, #000C28 100%)',
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out',
        float: 'float 6s ease-in-out infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        glowPulse: { '0%, 100%': { opacity: 0.8, filter: 'brightness(100%)' }, '50%': { opacity: 1, filter: 'brightness(130%)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
