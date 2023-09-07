/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        caesar: ['var(--font-caesar)'],
    
      
      },
      colors: {
        'sunset-pink': '#4f46e5',
        'sunset-orange': '#db2777',
      },
      backgroundImage: theme => ({
        'sunset-gradient': 'linear-gradient(to right, #FF6B6B, #FFB447)',



      }),
    
    },
  },
  plugins: [],
}
