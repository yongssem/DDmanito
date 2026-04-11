/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ddak: {
          cream: '#FFF5E1',
          pink: '#FFD6E0',
          mint: '#C8E6F5',
          lavender: '#E8D5F2',
          text: '#4A4A4A',
          accent: '#FF8FA3',
        },
      },
      fontFamily: {
        ssurround: ['Cafe24Ssurround', 'sans-serif'],
        pretendard: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
        bombom: ['"Nanum Pen Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
