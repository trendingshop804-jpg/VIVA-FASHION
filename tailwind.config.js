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
          magenta: {
            DEFAULT: '#C2185B',
            dark: '#A01348',
            light: '#D8437A',
            50: '#FDF2F6',
            100: '#FCE4EC',
            200: '#F8BBD0',
            300: '#F48FB1',
            400: '#F06292',
            500: '#C2185B',
            600: '#A01348',
            700: '#8C0F3D',
          },
          maroon: {
            DEFAULT: '#3A1F2E',
            dark: '#3A1234',
            light: '#5C2152',
          },
          cream: {
            DEFAULT: '#F5E6D3',
            50: '#FDF8F3',
            100: '#F5E6D3',
            200: '#EDD5C0',
            300: '#E5C4AD',
          },
          blush: {
            DEFAULT: '#F8C8DC',
            50: '#FDF2F6',
            100: '#F8C8DC',
            200: '#F5B0CC',
            300: '#F098BB',
          },
          sage: {
            DEFAULT: '#8A9E84',
            light: '#A8BAA3',
            dark: '#6E8268',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#E8C766',
            dark: '#B89726',
          },
          sand: {
            DEFAULT: '#EAE3D9',
            light: '#F4EFE6',
            dark: '#D8CFC3',
          },
          navy: {
            DEFAULT: '#1A1A2E',
            dark: '#12121F',
            light: '#2A2A3F',
          },
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'boutique': '0 20px 40px -15px rgba(194, 24, 91, 0.12)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
