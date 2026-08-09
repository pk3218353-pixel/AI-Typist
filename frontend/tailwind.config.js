/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mangal: ['Mangal', 'sans-serif'],
        'noto-devanagari': ['"Noto Sans Devanagari"', 'sans-serif'],
        'lohit-devanagari': ['"Lohit Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
