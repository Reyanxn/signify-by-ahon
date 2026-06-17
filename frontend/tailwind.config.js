/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fdf2f0', 100: '#f9e0db', 200: '#f3c1b7', 300: '#eda293', 400: '#e7836f', 500: '#d4735e', 600: '#b85a46', 700: '#9a4231', 800: '#7c2d1e', 900: '#5e1b0e' },
        secondary: { 50: '#f0f7f4', 100: '#dcefe3', 200: '#b9dfc7', 300: '#96cfab', 400: '#73bf8f', 500: '#5caa79', 600: '#4a8f63', 700: '#38744d', 800: '#265937', 900: '#143e21' },
        accent: { 50: '#faf5f0', 100: '#f0e6d9', 200: '#e0cdb3', 300: '#d0b48d', 400: '#c09b67', 500: '#a88451', 600: '#8a6a3f', 700: '#6c502d', 800: '#4e361b', 900: '#301c09' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Playfair Display', 'serif'] },
    },
  },
  plugins: [],
};
