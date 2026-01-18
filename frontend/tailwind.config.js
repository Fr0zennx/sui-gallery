/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        'dark-gray': '#18181b',
        neon: '#00f5ff',
      },
    },
  },
  plugins: [],
};
