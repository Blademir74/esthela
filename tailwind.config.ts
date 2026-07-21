import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        guinda: {
          DEFAULT: "#7A1F2B",
          deep: "#5E1520",
        },
        oro: {
          DEFAULT: "#D49A3A",
          light: "#F2CF8B",
        },
        sierra: {
          DEFAULT: "#244C3A",
          dark: "#11231D",
        },
        soberania: {
          DEFAULT: "#133B5C",
          dark: "#0D2940",
        },
        crema: "#F4EFE6",
        niebla: "#FFFDF8",
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "noise-pattern":
          "url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
      },
      boxShadow: {
        editorial: "0 30px 60px rgba(17,35,29,0.18)",
        territorial: "0 26px 70px rgba(17,35,29,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;