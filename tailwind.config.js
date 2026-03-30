/** @type {import('tailwindcss').Config} */
export default{
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./src/app/globals.css", 
  ],
   safelist: [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}