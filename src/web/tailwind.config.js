/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-main": "#16161a",
        "head-main": "#fffffe",
        "text-main": "#94a1b2",
        "btn-bg": "#7f5af0",
        "btn-text": "#fffffe",
        stroke: "#010101",
        link: "#2cb67d",
      },
    },
  },
  plugins: [],
};
