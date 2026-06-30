"use client";
import { useMemo, useState } from "react";
import type { Comune } from "@/lib/types";

function stripeColor(a: number): string {
  if (a <= -0.3) return "#4a86c4";
  if (a < 0.2) return "#cfe0d6";
  if (a < 0.6) return "#f4e6a8";
  if (a < 1.1) return "#F6C544";
  if (a < 1.7) return "#F39237";
  if (a < 2.3) return "#E4572E";
  return "#C81D25";
}

/** Strisce del riscaldamento (Ed Hawkins) con tooltip anno per anno. */
export default function WarmingStripes({ comune }: { comune: Comune }) {
  const base = comune.t_baseline_1961_1990;
  const data = useMemo(
    () => comune.series.map((p) => ({
      year: p.year,
      t: p.t_mean,
      anom: Math.round((p.t_mean - base) * 10) / 10,
      observed: p.source === "era5",
    })),
    [comune, base]
  );
  const [hover, setHover] = useState<number | null>(null);
  const w = 100 / data.length;
  const cur = hover != null ? data[hover] : null;

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-ink">Un colore per ogni anno · {comune.nome}</h3>
      </div>
      <p className="mb-3 text-xs leading-snug text-slate">
        Ogni striscia è un anno, dal più <span className="font-semibold text-[#4a86c4]">freddo</span> al
        più <span className="font-semibold text-[#C81D25]">caldo</span>. Passa il dito o il mouse sopra
        una striscia per vedere l'anno.
      </p>

      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="h-16 w-full rounded-md"
           onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => (
          <rect key={d.year} x={i * w} y={0} width={w + 0.3} height={14} fill={stripeColor(d.anom)}
                opacity={hover == null || hover === i ? 1 : 0.55}
                onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)}>
            <title>{`${d.year}: ${d.t}°C`}</title>
          </rect>
        ))}
        {hover != null && (
          <rect x={hover * w} y={0} width={w + 0.3} height={14} fill="none" stroke="#1C2B20" strokeWidth={0.5} />
        )}
      </svg>

      {(() => {
        const first = data[0].year, last = data[data.length - 1].year;
        const pos = (y: number) => ((y - first) / (last - first)) * 100;
        const ticks = [
          { y: first, label: String(first), align: "left" as const },
          { y: 1980, label: "1980" },
          { y: comune.today_year, label: "oggi" },
          { y: last, label: String(last), align: "right" as const },
        ];
        return (
          <div className="relative mt-1 h-4 text-[11px] text-slate">
            {ticks.map((t) => (
              <span key={t.label} className="absolute whitespace-nowrap"
                style={
                  t.align === "left" ? { left: 0 }
                  : t.align === "right" ? { right: 0 }
                  : { left: `${pos(t.y)}%`, transform: "translateX(-50%)" }
                }>
                {t.label}
              </span>
            ))}
          </div>
        );
      })()}

      {/* riga informativa che cambia al passaggio */}
      <div className="mt-3 rounded-lg bg-cloud/60 px-3 py-2 text-sm">
        {cur ? (
          <span className="text-ink">
            <b>{cur.year}</b> — temperatura media <b>{cur.t}°C</b>,{" "}
            <span style={{ color: stripeColor(cur.anom) }} className="font-semibold">
              {cur.anom >= 0 ? `+${cur.anom}°C più caldo` : `${cur.anom}°C più freddo`}
            </span>{" "}
            della media locale di lungo periodo{cur.observed ? "" : " (anno ricostruito)"}.
          </span>
        ) : (
          <span className="text-slate">Tocca una striscia per leggere i gradi di quell'anno.</span>
        )}
      </div>
    </div>
  );
}
