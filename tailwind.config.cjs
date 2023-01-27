// eslint-disable-next-line @typescript-eslint/no-var-requires
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        oxanium: ["Oxanium", "cursive"],
        opensans: ["Open Sans", "sans-serif"],
      },
      // height: {
      //   "1/20": "5%",
      //   "2/20": "10%",
      //   "3/20": "15%",
      //   "4/20": "20%",
      //   "5/20": "25%",
      //   "6/20": "30%",
      //   "7/20": "35%",
      //   "8/20": "40%",
      //   "9/20": "45%",
      //   "10/20": "50%",
      //   "11/20": "55%",
      //   "12/20": "60%",
      //   "13/20": "65%",
      //   "14/20": "70%",
      //   "15/20": "75%",
      //   "16/20": "80%",
      //   "17/20": "85%",
      //   "18/20": "90%",
      //   "19/20": "95%",
      //   "20/20": "100%",
      // },
    },
  },
  plugins: [],
};
