/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        roble: {
          light: "#F9FAF8",   // Fondo suave
          primary: "#D4A017", // Amarillo roble
          dark: "#6B4F1D",    // Madera / tronco
          accent: "#6B8E23",  // Verde oliva
          success: "#16A34A", // Verde de éxito
        },
      },
    },
  },
  plugins: [],
};
