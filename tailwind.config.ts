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
        background: "#0D1412",
        card: "#19231F",
        "card-hover": "#212F2A",
        accent: {
          DEFAULT: "#A3E635",
          hover: "#BEF264",
          dark: "#65A30D",
          dim: "rgba(163, 230, 53, 0.12)",
        },
        primaryText: "#F1F5F2",
        secondaryText: "#94A39B",
        borderGreen: "#23332B",
        borderActive: "#344B40",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Montserrat", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
