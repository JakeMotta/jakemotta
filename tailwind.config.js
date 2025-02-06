/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      'primary': '#1a73e8',
      'secondary': '#4285f4',
        // You can also use objects for shade variations
        'brand': {
          100: '#e6f0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff', // base
          600: '#0052cc',
          700: '#003d99',
        },
      },
    },
  },
  plugins: [],
};
