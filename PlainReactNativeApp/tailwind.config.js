/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#9DB2BF',
        lightGray: '#DDE6ED',
        darkBlue: '#27374D',
        lightBlue: '#526D82',
      },
    },
  },
  plugins: [],
};
