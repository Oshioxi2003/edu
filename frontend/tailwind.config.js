/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
    './src/common/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // IELTS brand colors
        primary: {
          DEFAULT: '#003A70',
          50: '#E6EEF5',
          100: '#CCE0EB',
          200: '#99C1D7',
          300: '#66A2C3',
          400: '#3383AF',
          500: '#003A70',
          600: '#002E5A',
          700: '#002343',
          800: '#00172D',
          900: '#000C16',
        },
        accent: {
          DEFAULT: '#FFD700',
          50: '#FFFDF0',
          100: '#FFFAE0',
          200: '#FFF5C2',
          300: '#FFF0A3',
          400: '#FFEB85',
          500: '#FFD700',
          600: '#E6C200',
          700: '#B39600',
          800: '#806B00',
          900: '#4D4000',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'var(--tp-ff-body)', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'var(--tp-ff-heading)', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 58, 112, 0.1), 0 2px 4px -1px rgba(0, 58, 112, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 58, 112, 0.1), 0 10px 10px -5px rgba(0, 58, 112, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

