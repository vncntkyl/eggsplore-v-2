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
      scrollbar: ["rounded"],
      backgroundImage: {
        login: "url('./assets/login_img.jpg')",
      },
      transitionTimingFunction: {
        toggle: "cubic-bezier(0,.72,1,.52)",
      },
      animation: {
        "slide-down": "slide-down 500ms ease-in-out forwards",
        "modal-slide-down": "container-slide-down 500ms ease-in-out forwards",
        "bounce-light": "bounce-light 1000ms ease-in-out infinite",
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
        "container-slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateX(-50%) translateY(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(-50%) translateY(-50%)",
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
        "bounce-light": {
          "0%": {
            transform: "translateY(0%)",
          },
          "50%": {
            transform: "translateY(-5%)",
          },
          "100%": {
            transform: "translateY(0%)",
          },
        },
      },
      colors: {
        main: "#B95446",
        black: "#222222",
        secondary: "#f46b45",
        tertiary: "#ffa68e",
        "blue-light": "#306088",
        "blue-light-1": "#b4d3fd",
        "red-light": "#d43953",
        "red-light-1": "#FDB4B4",
        "red-dark": "#883030",
        "red-dark-1": "#5c1c1c",
        yellow: "#f1c232",
        "yellow-light": "#fdf6b4",
        "yellow-dark": "#807519",
        "green-light": "#B5FDB4",
        "green-dark": "#198065",
        default: "#efedf8",
        "default-dark": "#dbd8eb",
      },
      width: {
        sidebar: "20rem",
        "sidebar-1/2": "10rem",
      },
      height: {
        navbar: "5rem",
      },
      spacing: {
        sidebar: "20rem",
        "sidebar-1/2": "10rem",
        navbar: "5rem",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
