import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: "#00d2ff",
        deep: "#0b111e",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 210, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
