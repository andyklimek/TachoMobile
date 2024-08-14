/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lightBeige: '#E9EEF5',
        darkPurple: '#5958b2',
        lightPurple: '#8092f4',
      },
      fontFamily: {
        custom: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
