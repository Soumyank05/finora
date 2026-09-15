/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#0B0F17',
          card: '#111827',
          cardHover: '#162032',
          border: '#1F293D',
          borderLight: '#2D3748',
          accent: '#10B981',
          accentBlue: '#3B82F6',
          accentPurple: '#8B5CF6',
          accentGold: '#F59E0B',
          danger: '#EF4444',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
