/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',
        'primary-ink': 'var(--color-primary-ink)',
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
  // Tailwind's own variables (--tw-translate-x and about thirty more) go only on elements whose classes use them,
  // instead of on every element and its ::before and ::after. Every element is restyled each time the hue moves,
  // and those variables were a third of the cost (docs/performance.md).
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
