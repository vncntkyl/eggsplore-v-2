/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "425px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        login: "url('./assets/login_img.jpg')",
      },
      transitionTimingFunction: {
        toggle: "cubic-bezier(0,.72,1,.52)",
      },
      animation: {
        "slide-down": "slide-down 500ms ease-in-out forwards",
        "slide-right": "slide-right 200ms ease-in-out forwards",
        fade: "fade 200ms ease-in-out forwards",
      },
      keyframes: {
        "slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-right": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      colors: {
        main: "#B95446",
        secondary: "#f46b45",
      },
    },
  },
  plugins: [],
};
