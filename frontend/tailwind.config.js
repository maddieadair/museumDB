/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
  theme: {
    extend: {
        colors: {
            'ivory': '#FFFFF5',
            'cinnabar': '#dc4c3c',
            'charcoal': '#171717',
          },
        backgroundImage: {
            'hero-giordano': "url('./assets/Luca_Giordano_-_Allegory_of_Prudence_-_Google_Art_Project.jpg')",
          },
        fontFamily: {
            'hk-grotesk': ['Hanken Grotesk', 'sans-serif'],
            'goudy-sm': ['Sorts Mill Goudy', 'serif'],
        }
    },
  },
  plugins: [],
}