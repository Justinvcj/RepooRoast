/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // v4 "Night Review": 60% ink canvas, 30% surfaces and text, 10% ember accent.
        background: '#0B0D14',
        dominant: '#0B0D14',
        surface: {
          DEFAULT: '#11141C',
          secondary: '#11141C',
          elevated: '#1A1E28',
        },
        border: {
          DEFAULT: '#1E222D',
          hairline: '#1E222D',
          focused: '#343A4A',
        },
        textPrimary: '#EEF0F5',
        textSecondary: '#A3A9B8',
        textMuted: '#838BA0',
        text: {
          primary: '#EEF0F5',
          secondary: '#A3A9B8',
          muted: '#838BA0',
        },
        ink: '#EEF0F5',
        primary: {
          DEFAULT: '#FF6B3D',
          hover: '#FF8157',
        },
        accent: {
          DEFAULT: '#FF6B3D',
          hover: '#FF8157',
          dark: '#0B0D14',
          deep: '#E85A2C',
        },
        success: '#4CC38A',
        warning: '#E5B93C',
        danger: '#F0595E',
        data: {
          success: '#4CC38A',
          warning: '#E5B93C',
          flawed: '#E88A4A',
          critical: '#F0595E',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Geist', 'system-ui', 'sans-serif'],
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
