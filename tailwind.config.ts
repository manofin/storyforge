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
        brand: {
          DEFAULT: "#E11D2E",
          50: "#FEF2F3",
          100: "#FDE6E8",
          200: "#FACCD1",
          300: "#F5A3AB",
          400: "#EE6B78",
          500: "#E11D2E",
          600: "#C41428",
          700: "#A41224",
          800: "#881322",
          900: "#741421",
        },
        send: {
          DEFAULT: "#14B8A6",
          hover: "#0D9488",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F7F8",
          soft: "#F3F4F6",
          border: "#E5E7EB",
          dark: "#374151",
        },
      },
      maxWidth: {
        desktop: "1280px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        card: "0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
