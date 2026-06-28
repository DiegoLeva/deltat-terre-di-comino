"use client";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import type { Comune } from "@/lib/types";

/**
 * Serie 1950–2030.
 *  - cyan  : t_obs   -> dati osservati ERA5 (source==="era5")
 *  - gray  : t_back  -> backcast modellato (source==="model" && !projected)
 *  - dashed yellow : t_proj -> proiezione 2026–2030 (projected===true)
 * I segmenti condividono il punto di giunzione per non spezzare la linea.
 */
function shape(comune: Comune) {
  const s = comune.series;
  return s.map((p, i) => {
    const prev = s[i - 1];
    const next = s[i + 1];
    const isObs = p.source === "era5";
    const isProj = p.projected;
    const isBack = p.source === "model" && !p.projected;

    // un punto appartiene a un segmento anche se confina con esso (giunzione continua)
    const touch = (pred: (x: typeof p) => boolean) =>
      pred(p) || (prev && pred(prev)) || (next && pred(next));

    return {
      year: p.year,
      t: p.t_mean,
      t_smooth: p.t_mean_smooth,
      t_obs: touch((x) => x.source === "era5") ? p.t_mean_smooth : null,
      t_back: touch((x) => x.source === "model" && !x.projected) ? p.t_mean_smooth : null,
      t_proj: touch((x) => x.projected) ? p.t_mean_smooth : null,
      src: p.source,
      projected: isProj,
      kind: isProj ? "PROIEZIONE" : isObs ? "OSSERVATO (ERA5)" : "BACKCAST MODELLO",
    };
  });
}

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = d.projected ? "#FFB020" : d.src === "era5" ? "#00E5C7" : "#5A6B86";
  return (
    <div className="panel px-3 py-2 text-[11px] shadow-hud">
      <div className="font-bold text-ink">ANNO {label}</div>
      <div className="text-muted">T media: <span className="font-bold text-cyan">{d.t}°C</span></div>
      <div className="text-muted">smooth 5y: {d.t_smooth}°C</div>
      <div style={{ color }} className="mt-1 font-bold">◇ {d.kind}</div>
    </div>
  );
}

export default function SeriesPanel({ comune }: { comune: Comune }) {
  const data = shape(comune);

  return (
    <div className="panel corner p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="hatch">SERIE TERMICA // {comune.nome} · {comune.quota_m} m s.l.m.</span>
        <div className="flex items-center gap-3 text-[10px]">
          <Lg c="#00E5C7" t="OSSERVATO" />
          <Lg c="#5A6B86" t="BACKCAST" />
          <Lg c="#FFB020" t="PROIEZIONE" dash />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="gObs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5C7" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00E5C7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1B2436" strokeDasharray="2 4" />
          <XAxis dataKey="year" tick={{ fill: "#5A6B86", fontSize: 10 }} stroke="#27324A"
                 ticks={[1950, 1970, 1990, 2010, 2025, 2030]} />
          <YAxis tick={{ fill: "#5A6B86", fontSize: 10 }} stroke="#27324A"
                 domain={["dataMin - 0.4", "dataMax + 0.4"]} unit="°" width={46} />
          <Tooltip content={<TT />} cursor={{ stroke: "#00E5C7", strokeOpacity: 0.3 }} />

          {/* riferimento ultimo anno osservato */}
          <ReferenceLine x={2025} stroke="#27324A" strokeDasharray="4 4"
            label={{ value: "OGGI", fill: "#5A6B86", fontSize: 9, position: "top" }} />

          <Area dataKey="t_obs" stroke="none" fill="url(#gObs)" isAnimationActive={false} />
          <Line dataKey="t_back" stroke="#5A6B86" strokeWidth={1.6} dot={false} connectNulls isAnimationActive={false} />
          <Line dataKey="t_obs" stroke="#00E5C7" strokeWidth={2.2} dot={false} connectNulls isAnimationActive={false} />
          <Line dataKey="t_proj" stroke="#FFB020" strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="mt-2 border-t border-line pt-2 text-[10px] leading-tight text-muted">
        <span className="font-bold text-cyandim">⚠ NOTA METODOLOGICA — LAPSE-RATE.</span>{" "}
        La griglia ERA5 (0.25°, ~25 km) raggruppa più comuni nella stessa cella. La serie è
        downscalata per quota applicando un gradiente altimetrico di −6,5 °C/km tra la quota
        del comune ({comune.quota_m} m) e l&apos;orografia media della cella ERA5. Per questo
        comuni nella stessa cella (es. Cassino 45 m vs Picinisco 725 m) mostrano valori e
        conteggi di soglia distinti e fisicamente coerenti.
      </p>
    </div>
  );
}

function Lg({ c, t, dash }: { c: string; t: string; dash?: boolean }) {
  return (
    <span className="flex items-center gap-1 text-muted">
      <svg width="16" height="6"><line x1="0" y1="3" x2="16" y2="3" stroke={c} strokeWidth="2"
        strokeDasharray={dash ? "4 3" : undefined} /></svg>
      {t}
    </span>
  );
}
