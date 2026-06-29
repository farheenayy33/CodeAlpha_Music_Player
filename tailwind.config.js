/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 18px 60px rgba(0, 0, 0, 0.28)",
      },
      colors: {
        ink: "#101312",
        moss: "#24332f",
        coral: "#ff6b57",
        citron: "#f4d35e",
        pool: "#20c997",
      },
    },
  },
  plugins: [],
};
