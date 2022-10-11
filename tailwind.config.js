/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // sidebr #202020
// min #272727
// boxes #323232
// current nvbr #2d2d2d
  theme: {
    colors: {
      'primary': '#1e272e',
      'white': '#fff',
      'secondary': '#3e3e3e',  
      'tertiary': '#09c7e1',    
      'card': '#222b32',
      'sidebar': '#2b343b'
    },
    fontFamily: {
      'headings': ['Poppins', 'sans-serif'],
      'body': ['Montserrat', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'hero-img': "url('./components/assets/bg.png')",
        'footer-img': "url('./components/assets/footerbg.png')"
      },
      height: {
        '128': '39rem',
        '130': '32rem'
      },
      width: {        
        '129': '59rem',
        '131': '30rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
