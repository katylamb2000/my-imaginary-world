/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        '120': '30rem',
      },
      height: {
        '120': '30rem',
      },
      fontSize: {
        '24': '24px',
        '25': '25px',
        '26': '26px',
        '27': '27px',
        '28': '28px',
        '30': '30px',
        // Add as many as you need
      },
    },
  },
  plugins: [],
}
