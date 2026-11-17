/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // v4 "Red Pen": cool paper, white sheets, ink, one pen-red accent.
        background: '#F3F4F1',
        dominant: '#F3F4F1',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#FFFFFF',
          elevated: '#FAFAF7',
        },
        border: {
          DEFAULT: '#D8DAD3',
          hairline: '#D8DAD3',
          focused: '#8E948C',
        },
        textPrimary: '#16181D',
        textSecondary: '#4A505A',
        textMuted: '#646A73',
        text: {
          primary: '#16181D',
          secondary: '#4A505A',
          muted: '#646A73',
        },
        ink: '#16181D',
        primary: {
          DEFAULT: '#D1301C',
          hover: '#B52614',
        },
        accent: {
          DEFAULT: '#D1301C',
          hover: '#B52614',
          dark: '#FFFFFF',
          deep: '#B52614',
        },
        success: '#17794A',
        warning: '#946000',
        danger: '#C62A1B',
        data: {
          success: '#17794A',
          warning: '#946000',
          flawed: '#B4480A',
          critical: '#C62A1B',
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
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
