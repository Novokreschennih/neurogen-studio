/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.1)',
        background: '#05050a',
        foreground: '#ffffff',
      },
    },
  },
  plugins: [],
}
