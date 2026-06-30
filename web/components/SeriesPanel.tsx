"use client";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import type { Comune } from "@/lib/types";

function shape(comune: Comune) {
  const s = comune.series;
  return s.map((p, i) => {
    const prev = s[i - 1], next = s[i + 1];
    const touch = (pred: (x: typeof p) => boolean) =>
      pred(p) || (!!prev && pred(prev)) || (!!next && pred(next));
    return {
      year: p.year,
      t: p.t_mean,
      smooth: p.t_mean_smooth,
      obs: touch((x) => x.source === "era5") ? p.t_mean_smooth : null,
      back: touch((x) => x.source === "model" && !x.projected) ? p.t_mean_smooth : null,
      proj: touch((x) => x.projected) ? p.t_mean_smooth : null,
      src: p.source,
      projected: p.projected,
    };
  });
}

function TT({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const kind = d.projected ? "stima per i prossimi anni" : d.src === "era5" ? "dato misurato" : "ricostruzione del passato";
  return (
    <div className="card px-3 py-2 text-xs">
      <div className="font-semibold text-ink">Anno {label}</div>
      <div className="text-slate">Temperatura media: <b className="text-ink">{d.t}°C</b></div>
      <div className="mt-1 text-brand">{kind}</div>
    </div>
  );
}

export default function SeriesPanel({ comune }: { comune: Comune }) {
  const data = shape(comune);
  return (
    <div className="card p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Andamento termico · {comune.nome}</h3>
          <p className="text-sm text-slate">Temperatura media annua, {comune.quota_m} m s.l.m.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate">
          <Lg c="#135B4C" t="osservato" />
          <Lg c="#9fb0aa" t="ricostruito" />
          <Lg c="#E4572E" t="proiezione" dash />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 6 }}>
          <defs>
            <linearGradient id="gObs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#135B4C" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#135B4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef3f0" />
          <XAxis dataKey="year" tick={{ fill: "#3B6675", fontSize: 11 }} stroke="#dbe4df"
                 ticks={[1950, 1980, 2011, 2025, 2050]} />
          <YAxis tick={{ fill: "#3B6675", fontSize: 11 }} stroke="#dbe4df"
                 domain={[(min: number) => Math.floor(min - 0.5), (max: number) => Math.ceil(max + 0.5)]}
                 allowDecimals={false} tickFormatter={(v: number) => `${Math.round(v)}°`} width={40} />
          <Tooltip content={<TT />} />
          <ReferenceLine x={2011} stroke="#3B6675" strokeDasharray="4 4"
            label={{ value: "2011", fill: "#3B6675", fontSize: 10, position: "insideTopLeft" }} />
          <ReferenceLine x={2025} stroke="#9fb0aa" strokeDasharray="3 3"
            label={{ value: "oggi", fill: "#3B6675", fontSize: 10, position: "top" }} />
          <Area dataKey="obs" stroke="none" fill="url(#gObs)" isAnimationActive={false} />
          <Line dataKey="back" stroke="#9fb0aa" strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
          <Line dataKey="obs" stroke="#135B4C" strokeWidth={2.6} dot={false} connectNulls isAnimationActive={false} />
          <Line dataKey="proj" stroke="#E4572E" strokeWidth={2.2} strokeDasharray="6 4" dot={false} connectNulls isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="mt-2 border-t border-[#eef3f0] pt-2 text-xs leading-snug text-slate">
        La linea verde è la temperatura davvero misurata dai satelliti negli ultimi anni; in grigio la
        ricostruzione del passato e in arancione la stima per i prossimi anni. I valori sono corretti
        in base all'altitudine di ogni paese.
      </p>
    </div>
  );
}

function Lg({ c, t, dash }: { c: string; t: string; dash?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={c} strokeWidth="2.5"
        strokeDasharray={dash ? "4 3" : undefined} /></svg>{t}
    </span>
  );
}
