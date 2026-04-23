/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#30363d',
        primary: '#f97316',
        success: '#3fb950',
        warning: '#d29922',
        danger: '#f85149',
        textPrimary: '#e6edf3',
        textSecondary: '#8b949e'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Bricolage Grotesque"', 'serif']
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3.5rem'
      }
    },
  },
  plugins: [],
}
