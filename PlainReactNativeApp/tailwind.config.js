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
        // darkGray: '#37414d',
        // midGray: '#969ca4',
        // lightGray: '#f5f6fa',
        // darkBlue: '#455af7',
        // midBlue: '#94a8fb',
        // lightBlue: '#e2f5ff',
      },
    },
  },
  plugins: [],
};
