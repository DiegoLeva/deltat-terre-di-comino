"use client";
import type { Comune } from "@/lib/types";
import { stripeAnomaly } from "@/lib/impacts";

/** Colore stripe da anomalia (°C vs baseline 1961-1990). Palette HUD aggressiva. */
function stripeColor(a: number): string {
  if (a <= -0.4) return "#1E4A8A";
  if (a <= -0.1) return "#3B7BC4";
  if (a < 0.2) return "#0A8A7A";
  if (a < 0.6) return "#7CFF6B";
  if (a < 1.1) return "#FFB020";
  if (a < 1.7) return "#FF7A18";
  if (a < 2.3) return "#FF2E4D";
  return "#B3001B";
}

export default function WarmingStripes({ comune }: { comune: Comune }) {
  const data = stripeAnomaly(comune);
  const w = 100 / data.length;

  return (
    <div className="panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="hatch">WARMING STRIPES // {comune.nome} 1950–2030</span>
        <span className="hatch text-cyandim">Δ vs 1961–1990</span>
      </div>
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="h-12 w-full">
        {data.map((d, i) => (
          <rect
            key={d.year}
            x={i * w}
            y={0}
            width={w + 0.3}
            height={14}
            fill={stripeColor(d.anom)}
            opacity={d.src === "model" ? 0.78 : 1}
          >
            <title>{`${d.year}  ${d.anom >= 0 ? "+" : ""}${d.anom}°C  [${d.src}]`}</title>
          </rect>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-muted">
        <span>1950</span><span>1990</span><span>2025</span><span>2030 ▸</span>
      </div>
    </div>
  );
}
