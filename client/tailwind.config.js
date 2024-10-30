// /** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/react/utils/withMT");
// // export default {
//   module.exports = withMT({
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
    
//   ],
//   theme: {
//     extend: {

//     },
//   },
//   plugins: [],
// })
/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50",
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        deep_orange: {
          50: "#fbe9e7",
          100: "#ffccbc",
          200: "#ffab91",
          300: "#ff8a65",
          400: "#ff7043",
          500: "#ff5722",
          600: "#f4511e",
          700: "#e64a19",
          800: "#d84315",
          900: "#bf360c",
        },
      },
    },
  },
  plugins: [],
});