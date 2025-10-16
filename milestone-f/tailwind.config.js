/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Main brand color
        secondary: '#10B981',    // Secondary color
        light: '#F2F3F4',        // Light background
        success: '#10B981',      // Success messages
        hover: {
          primary: '#2563EB',    // Hover state for primary
          secondary: '#059669',  // Hover state for secondary
          accent: '#D97706',     // Hover state for accent
          danger: '#DC2626',     // Hover state for danger
        }
      },
      fontSize: {
        'heading-xl': ['3rem', { lineHeight: '1.2' }],      // 48px
        'heading-lg': ['2.25rem', { lineHeight: '1.3' }],   // 36px
        'heading-md': ['1.875rem', { lineHeight: '1.3' }],  // 30px
        'heading-sm': ['1.5rem', { lineHeight: '1.4' }],    // 24px
        'paragraph-lg': ['1.125rem', { lineHeight: '1.6' }], // 18px
        'paragraph': ['1rem', { lineHeight: '1.6' }],        // 16px
        'paragraph-sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      }
    },
  },
  plugins: [],
}