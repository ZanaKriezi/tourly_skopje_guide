// tailwind.config.js

import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Refreshed color palette
        primary: {
          50: '#eef9ff',
          100: '#dcf3ff',
          200: '#b3e7ff',
          300: '#75d8ff',
          400: '#2cc3ff',
          500: '#06adf2',
          600: '#0089cd',
          700: '#006da6',
          800: '#005a88',
          900: '#084b71',
          950: '#06314b',
        },
        secondary: {
          50: '#f5f8fb',
          100: '#eaf1f8',
          200: '#d5e2f1',
          300: '#b4cce5',
          400: '#8aafd7',
          500: '#6b94ca',
          600: '#5379bc',
          700: '#4567ab',
          800: '#3c558c',
          900: '#334870',
          950: '#222d46',
        },
        accent: {
          50: '#f1f9fe',
          100: '#e3f3fd',
          200: '#c5e7fb',
          300: '#9ad7f7',
          400: '#65bff1',
          500: '#3ea7ea',
          600: '#2488db',
          700: '#1e6fc5',
          800: '#1f5ca1',
          900: '#1f4c80',
          950: '#173050',
        },
        success: {
          50: '#eefbf3',
          100: '#d6f5e3',
          200: '#afebca',
          300: '#79dba9',
          400: '#43c382',
          500: '#26a669',
          600: '#1b8654',
          700: '#196946',
          800: '#17533a',
          900: '#154531',
          950: '#0b271d',
        },
        danger: {
          50: '#fef2f3',
          100: '#fee2e3',
          200: '#fecacf',
          300: '#fca3ab',
          400: '#f86d7a',
          500: '#ec4055',
          600: '#d21e3b',
          700: '#b0152f',
          800: '#94152d',
          900: '#7d172c',
          950: '#440812',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#030712',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'card-hover': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        'button': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'button-hover': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'header': '0 2px 4px rgba(0,0,0,0.10)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    forms,
  ],
}