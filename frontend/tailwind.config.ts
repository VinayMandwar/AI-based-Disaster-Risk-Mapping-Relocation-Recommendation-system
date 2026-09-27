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
        risk: {
          safe: "#10b981",       // Green
          moderate: "#f59e0b",   // Yellow
          high: "#f97316",       // Orange
          critical: "#ef4444",   // Red
        },
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#0d9488",
          700: "#0f766e",
          900: "#134e4a",
        },
        gov: {
          navy: "#0f172a",
          slate: "#1e293b",
          border: "#334155",
          accent: "#2563eb",
        }
      },
    },
  },
  plugins: [],
};
export default config;
