/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ["./src/**/*.tsx", "./pages/**/*.tsx", "./app/**/*.tsx"], // Add paths to your Next.js components
  theme: {
    extend: {
      fontSize: {
        custom: "var(--font-size)",
      },
    },
  },
  plugins: [],
};
