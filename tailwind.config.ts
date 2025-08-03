import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C97A7",       
        secondary: "#475569",     
        accent: "#A855F7",       
        success: "#22C55E",      
        danger: "#EF4444",     
        muted: "#9CA3AF",      
        background: "#F8FAFC",  
        darkBackground: "#121212"
      },
    },
  },
  plugins: [],
} satisfies Config;
