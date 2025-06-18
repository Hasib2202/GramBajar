module.exports = {
  darkMode: 'class', // Add this line
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#182628",
        primary: "#65CCB8",
        secondary: "#57BA98",
        accent: "#3B945E",
        light: "#F2F2F2",
      },
    },
  },
  plugins: [],
}