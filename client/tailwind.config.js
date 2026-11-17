/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- 60-30-10 Brand Architecture & Tokens ---
        // 60% Dominant Canvas
        background: '#0C0E12',
        dominant: '#0C0E12',

        // 30% Structural Surfaces & Typography
        surface: {
          DEFAULT: '#161920',
          secondary: '#161920',
          elevated: '#1F242E',
        },
        border: {
          DEFAULT: '#222733',
          hairline: '#222733',
          focused: '#3A4356',
        },
        textPrimary: '#F0F3F6',
        textSecondary: '#949CA6',
        textMuted: '#646E7E',
        text: {
          primary: '#F0F3F6',
          secondary: '#949CA6',
          muted: '#646E7E',
        },

        // 10% Brand Accent
        primary: {
          DEFAULT: '#FF5426',
          hover: '#E84518',
        },
        accent: {
          DEFAULT: '#FF5426',
          hover: '#E84518',
          dark: '#0C0E12',
          deep: '#D83B01',
        },

        // Semantic Telemetry Data Colors (outside accent budget)
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        data: {
          success: '#10B981',
          warning: '#F59E0B',
          flawed: '#E67E22',
          critical: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        // Backward-compatibility alias: maps legacy font-serif usages to Plus Jakarta Sans
        serif: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        // Preserve legacy tokens if referenced
        '4xl': '2.5rem',
        '5xl': '3.5rem',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-settle': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      transitionDuration: {
        'instant': '80ms',
        'fast': '150ms',
        'base': '250ms',
        'slow': '400ms',
        'assembly': '1400ms',
        'respiration': '2400ms',
      },
    },
  },
  plugins: [],
}
