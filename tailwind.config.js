/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#10131D",
          sidebar: "#171B28",
          card: "#1E2433",
          border: "#343B4D",
        },
        brand: {
          primary: "#7057E8",
          secondary: "#20B8CF",
          success: "#159A72",
          warning: "#D98A18",
          danger: "#D64545",
          text: "#F7F8FC",
          muted: "#A6AEC0",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      spacing: {
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      }
    },
  },
  plugins: [],
};
