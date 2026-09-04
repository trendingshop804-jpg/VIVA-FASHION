/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        viva: {
          blush: {
            DEFAULT: '#F5EBE6',
            50: '#FAF4F1',
            100: '#F5EBE6',
            200: '#EAD7CD',
            300: '#DEC3B5',
            400: '#D2AF9D',
            500: '#C69B85',
          },
          cream: {
            DEFAULT: '#FDFBF7',
            50: '#FFFFFF',
            100: '#FDFBF7',
            200: '#F8F4EC',
            300: '#F2ECE0',
            400: '#EAE1D2',
          },
          terracotta: {
            DEFAULT: '#C27D6E',
            dark: '#A66355',
            light: '#D99A8C',
          },
          sand: {
            DEFAULT: '#EAE3D9',
            light: '#F4EFE6',
            dark: '#D8CFC3',
          },
          navy: {
            DEFAULT: '#191E28',
            dark: '#12161E',
            light: '#28303F',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#E8C766',
            dark: '#B89726',
          },
          sage: {
            DEFAULT: '#8A9E84',
            light: '#A8BAA3',
            dark: '#6E8268',
          },
          mustard: {
            DEFAULT: '#DCA134',
            light: '#ECC068',
            dark: '#BF851E',
          },
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'boutique': '0 20px 40px -15px rgba(194, 125, 110, 0.12)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
