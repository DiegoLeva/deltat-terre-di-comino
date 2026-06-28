"use client";
import type { Comune } from "@/lib/types";
import { stripeAnomaly } from "@/lib/impacts";

function stripeColor(a: number): string {
  if (a <= -0.3) return "#7fa8c9";
  if (a < 0.2) return "#cfe0d6";
  if (a < 0.6) return "#f4e6a8";
  if (a < 1.1) return "#F6C544";
  if (a < 1.7) return "#F39237";
  if (a < 2.3) return "#E4572E";
  return "#C81D25";
}

/** Warming stripes (Ed Hawkins) per comune, palette su sfondo chiaro. */
export default function WarmingStripes({ comune }: { comune: Comune }) {
  const data = stripeAnomaly(comune);
  const w = 100 / data.length;
  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-ink">Strisce del riscaldamento · {comune.nome}</h3>
        <span className="text-xs text-slate">ogni striscia = un anno · 1950 → 2030</span>
      </div>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="h-14 w-full rounded-md">
        {data.map((d, i) => (
          <rect key={d.year} x={i * w} y={0} width={w + 0.3} height={12} fill={stripeColor(d.anom)}>
            <title>{`${d.year}: ${d.anom >= 0 ? "+" : ""}${d.anom}°C`}</title>
          </rect>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-slate"><span>1950</span><span>2011</span><span>2030</span></div>
    </div>
  );
}
