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
        // Paleta principal — "Por los Caminos del Sur"
        terracota: {
          DEFAULT: "#C85A32",
          dark:    "#A04526",
          light:   "#E07A52",
        },
        sierra: {
          DEFAULT: "#2D5A27",
          dark:    "#1C3A18",
          light:   "#4A8044",
        },
        pacifico: {
          DEFAULT: "#0F4C81",
          dark:    "#083660",
          light:   "#1A6AAD",
        },
        miel: {
          DEFAULT: "#E5A93C",
          dark:    "#B8842A",
          light:   "#F2CF8B",
        },
        // Neutros editoriales
        arido:    "#F8F9FA",
        niebla:   "#FFFDF8",
        crema:    "#F4EFE6",
        carbon:   "#1A1A18",
        // Aliases semánticos heredados (compatibilidad)
        guinda: {
          DEFAULT: "#7A1F2B",
          deep:    "#5E1520",
        },
        oro: {
          DEFAULT: "#D49A3A",
          light:   "#F2CF8B",
        },
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans:      ["var(--font-inter)", "Arial", "sans-serif"],
        display:   ["var(--font-editorial)", "Georgia", "serif"],
      },
      fontSize: {
        "10xl": ["10rem",  { lineHeight: "0.88" }],
        "9xl":  ["8rem",   { lineHeight: "0.9"  }],
      },
      spacing: {
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "4.5": "1.125rem",
        "7.5": "1.875rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      backgroundImage: {
        "noise-pattern":
          "url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')",
        "grain-dark":
          "url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27g%27%3E%3CfeTurbulence type=%27turbulence%27 baseFrequency=%270.75%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23g)%27 opacity=%270.08%27/%3E%3C/svg%3E')",
      },
      boxShadow: {
        editorial:   "0 30px 60px rgba(26,26,24,0.18)",
        territorial: "0 26px 70px rgba(26,26,24,0.25)",
        glow:        "0 0 40px rgba(200,90,50,0.25)",
        "glow-miel": "0 0 40px rgba(229,169,60,0.3)",
      },
      animation: {
        "ticker":       "ticker 40s linear infinite",
        "ticker-fast":  "ticker 25s linear infinite",
        "pulse-slow":   "pulse 4s ease-in-out infinite",
        "float":        "float 6s ease-in-out infinite",
        "fade-up":      "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)"  },
          "50%":      { transform: "translateY(-8px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
      },
    },
  },
  plugins: [],
};
export default config;