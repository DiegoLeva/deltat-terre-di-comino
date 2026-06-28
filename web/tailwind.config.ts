import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Palette istituzionale Galverla / GAL Versante Laziale del PNA ---
        ink: "#17161A",        // testo principale
        brand: "#135B4C",      // verde scuro brand
        accent: "#00E66E",     // verde acceso
        slate: "#3B6675",      // ardesia
        mint: "#D3E5D9",       // verde pallido
        cloud: "#ECF1F5",      // grigio chiaro sezioni
        paper: "#FFFFFF",
        // --- scala calore (per la temperatura, leggibile su chiaro) ---
        warm1: "#F6C544",
        warm2: "#F39237",
        warm3: "#E4572E",
        warm4: "#C81D25",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "Poppins", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,22,26,0.04), 0 8px 24px rgba(23,22,26,0.06)",
        lift: "0 12px 40px rgba(19,91,76,0.12)",
      },
      borderRadius: { xl2: "1.25rem" },
      keyframes: {
        countup: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        countup: "countup .5s ease-out both",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
