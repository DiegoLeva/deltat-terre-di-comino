"use client";
import {
  ComposedChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import type { Monthly } from "@/lib/types";
import { MESI, MESI_LONG } from "@/lib/types";

function scartoColor(s: number): string {
  if (s <= 0) return "#3E7CB1";
  if (s < 0.6) return "#9FC79B";
  if (s < 1.2) return "#F0C84B";
  if (s < 1.8) return "#EE9B3A";
  if (s < 2.4) return "#E4572E";
  return "#C81D25";
}

function TT({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card px-3 py-2 text-xs">
      <div className="font-semibold capitalize text-ink">{MESI_LONG[d.m - 1]}</div>
      <div className="text-slate">clima 1961-1990: <b>{d.baseline}°C</b></div>
      <div className="text-slate">oggi: <b>{d.recent}°C</b></div>
      <div className="mt-1 font-semibold" style={{ color: scartoColor(d.scarto) }}>
        {d.scarto >= 0 ? "+" : ""}{d.scarto}°C
      </div>
    </div>
  );
}

export default function MonthlyChart({ monthly }: { monthly: Monthly }) {
  const data = monthly.months.map((mp) => ({
    ...mp,
    name: MESI[mp.m - 1],
    base_period: monthly.base_period,
    recent_period: monthly.recent_period,
  }));

  return (
    <div className="card p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-ink">Quanto fa più caldo, mese per mese</h3>
        <p className="text-xs text-slate">gradi in più rispetto al clima del 1961-1990</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 16, right: 10, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#eef1ea" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#5E6E62", fontSize: 11 }} stroke="#dde3d8" interval={0} />
          <YAxis tick={{ fill: "#5E6E62", fontSize: 11 }} stroke="#dde3d8" width={38}
                 tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}°`} />
          <Tooltip content={<TT />} cursor={{ fill: "rgba(46,125,67,0.05)" }} />
          <ReferenceLine y={monthly.scarto_medio} stroke="#2E7D43" strokeDasharray="5 4"
            label={{ value: `media +${monthly.scarto_medio}°`, fill: "#2E7D43", fontSize: 10, position: "right" }} />
          <ReferenceLine y={0} stroke="#bcc6b8" />
          <Bar dataKey="scarto" radius={[4, 4, 0, 0]} maxBarSize={34}>
            {data.map((d) => <Cell key={d.m} fill={scartoColor(d.scarto)} />)}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-slate">
        Ogni barra è un mese e mostra di quanti gradi è più caldo oggi rispetto al clima del trentennio
        1961-1990. Sono soprattutto i mesi caldi a salire: l'estate è la stagione che cambia di più.
      </p>
    </div>
  );
}
