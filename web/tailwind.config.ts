import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Palette dal logo GAL Versante Laziale del PNA (camoscio/sole/crema) ---
        ink: "#1C2B20",        // testo principale (verde quasi nero)
        brand: "#2E7D43",      // verde foresta (camoscio)
        brandDark: "#1E5E34",
        accent: "#3FAE5A",     // verde chiaro
        gold: "#EAC23B",       // sole del logo
        slate: "#5E6E62",      // grigio-verde testo secondario
        mint: "#DCEBDD",       // verde pallido
        cream: "#F5EFDC",      // crema sezioni
        sand: "#EAE2C7",       // beige logo
        cloud: "#F1F3EE",
        paper: "#FFFFFF",
        // --- scala calore (anomalia termica), blu->rosso ---
        cold: "#3E7CB1",
        warm0: "#9FC79B",
        warm1: "#F0C84B",
        warm2: "#EE9B3A",
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
