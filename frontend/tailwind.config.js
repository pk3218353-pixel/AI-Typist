/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mangal: ['Mangal', 'sans-serif'],
        'noto-devanagari': ['"Noto Sans Devanagari"', 'sans-serif'],
        'lohit-devanagari': ['"Lohit Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
