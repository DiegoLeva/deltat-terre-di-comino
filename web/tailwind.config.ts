import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        panel: "#0F1525",
        grid: "#1B2436",
        line: "#27324A",
        cyan: "#00E5C7",
        cyandim: "#0A8A7A",
        lime: "#7CFF6B",
        amber: "#FFB020",
        orange: "#FF7A18",
        red: "#FF2E4D",
        muted: "#5A6B86",
        ink: "#C8D6E5",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "Roboto Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        hud: "0 0 0 1px rgba(0,229,199,0.15), 0 0 24px rgba(0,229,199,0.06)",
        glow: "0 0 18px rgba(0,229,199,0.35)",
      },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        scan: { "0%,100%": { opacity: "0.04" }, "50%": { opacity: "0.10" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0.2" } },
      },
      animation: {
        ticker: "ticker 38s linear infinite",
        scan: "scan 4s ease-in-out infinite",
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
