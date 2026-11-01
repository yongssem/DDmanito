/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ddak: {
          cream: '#FFFAEF',
          pink: '#E8EFDA',
          mint: '#E8EFDA',
          lavender: '#E8EFDA',
          text: '#342C21',
          accent: '#237E7F',
        },
      },
      fontFamily: {
        ssurround: ['Paperlogy', 'system-ui', 'sans-serif'],
        pretendard: ['Paperlogy', 'system-ui', 'sans-serif'],
        bombom: ['Paperlogy', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
