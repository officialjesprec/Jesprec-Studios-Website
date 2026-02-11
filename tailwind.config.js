/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}" // Catch root files like App.tsx
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        brand: {
          purple: "#BF00FF",
          cyan: "#00FFFF",
          pink: "#FF007F"
        },
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        foreground: "var(--foreground)",
        background: "var(--background)"
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}
