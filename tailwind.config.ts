import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        iu: {
          blue: {
            100: "#E6EEFB",
            500: "#1F5FCC",
            700: "#0B3C8C", // Primary IU Navy
            900: "#08265E", // Dark IU Navy
          },
          gold: "#F2B705",
          red: "#D92D20",
          green: "#12B76A",
          gray: {
            100: "#F2F4F7",
            600: "#475467",
            900: "#101828",
          },
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Merriweather", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
