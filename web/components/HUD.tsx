"use client";
import type { Comune } from "@/lib/types";
import { computeDelta } from "@/lib/impacts";
import ImpactCard from "./ImpactCard";
import WarmingStripes from "./WarmingStripes";

function deltaColor(d: number): string {
  if (d >= 2.0) return "#FF2E4D";
  if (d >= 1.5) return "#FF7A18";
  if (d >= 0.8) return "#FFB020";
  if (d >= 0) return "#7CFF6B";
  return "#00E5C7";
}

export default function HUD({
  comune,
  birthYear,
  toYear,
}: {
  comune: Comune;
  birthYear: number;
  toYear: number;
}) {
  const res = computeDelta(comune, birthYear, toYear);
  const col = deltaColor(res.deltaT);
  const sign = res.deltaT >= 0 ? "+" : "";

  return (
    <div className="panel-glow panel corner relative overflow-hidden p-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="hatch">MOTORE D&apos;IMPATTO // ΔT VISSUTO</span>
        <span className="hatch text-cyandim">
          {res.fromYear} → {res.toYear} · {comune.nome.toUpperCase()}
        </span>
      </div>

      {/* ΔT gigante */}
      <div className="my-4 flex items-center justify-center">
        <div className="text-center leading-none">
          <div
            className="font-bold tabular-nums"
            style={{ color: col, fontSize: "5.5rem", textShadow: `0 0 32px ${col}55` }}
          >
            {sign}{res.deltaT.toFixed(1)}
            <span className="ml-2 align-top text-3xl text-muted">°C</span>
          </div>
          <div className="mt-1 text-[11px] tracking-widest text-muted">
            RISCALDAMENTO LOCALE DALLA TUA NASCITA
          </div>
        </div>
      </div>

      {/* badge source dell'anno selezionato */}
      <div className="mb-3 flex justify-center">
        <span
          className={`rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest ${
            res.point.source === "era5" ? "bg-cyan/10 text-cyan" : "bg-amber/10 text-amber"
          }`}
        >
          {res.point.source === "era5"
            ? `◉ ANNO ${res.point.year}: DATI OSSERVATI ERA5`
            : `≈ ANNO ${res.point.year}: ${res.point.projected ? "PROIEZIONE" : "BACKCAST"} MODELLO`}
        </span>
      </div>

      {/* 4 card impatto */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {res.impacts.map((imp) => (
          <ImpactCard key={imp.label} impact={imp} />
        ))}
      </div>

      {/* warming stripes integrate in basso */}
      <div className="mt-4">
        <WarmingStripes comune={comune} />
      </div>
    </div>
  );
}
