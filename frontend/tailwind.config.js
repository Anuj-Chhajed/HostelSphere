/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        bgPrimary: '#0a0a0b',
        bgSecondary: '#121214',
        bgTertiary: '#1c1c1f',
        accentPrimary: '#8b5cf6',
        accentHover: '#7c3aed',
        accentGlow: 'rgba(139, 92, 246, 0.4)',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textTertiary: '#64748b',
      },
      animation: {
        'slideUpFade': 'slideUpFade 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'pulseGlow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        slideUpFade: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
