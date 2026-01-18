/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        racing: {
          dark: '#0a0a0a',
          darker: '#050505',
          accent: '#ff0050',
          gold: '#ffd700',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
        }
      },
      backgroundImage: {
        'racing-gradient': 'linear-gradient(135deg, #ff0050 0%, #ff6b00 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      }
    },
  },
  plugins: [],
}
