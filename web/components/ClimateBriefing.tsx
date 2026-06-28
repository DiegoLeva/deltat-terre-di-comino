"use client";
import { PARIS } from "@/lib/paesc";

/** Termometro: confronta il ΔT personale con le soglie di Parigi 1.5 / 2.0 °C. */
export default function ClimateBriefing({ deltaT }: { deltaT: number }) {
  const max = 2.6;
  const pct = (v: number) => Math.min(100, Math.max(0, (v / max) * 100));
  const level =
    deltaT >= PARIS.hard ? { c: "#FF2E4D", t: "OLTRE +2.0°C — SOGLIA CRITICA" }
    : deltaT >= PARIS.soft ? { c: "#FF7A18", t: "OLTRE +1.5°C — SOGLIA PARIGI" }
    : { c: "#7CFF6B", t: "SOTTO +1.5°C" };

  return (
    <div className="panel corner p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="hatch">CLIMATE BRIEFING // ACCORDO DI PARIGI</span>
        <span style={{ color: level.c }} className="text-[10px] font-bold">{level.t}</span>
      </div>

      {/* termometro verticale */}
      <div className="flex items-stretch gap-4">
        <div className="relative h-40 w-7 overflow-hidden rounded-full border border-line bg-grid">
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{
              height: `${pct(deltaT)}%`,
              background: "linear-gradient(0deg,#00E5C7,#FFB020,#FF7A18,#FF2E4D)",
            }}
          />
          {/* soglie */}
          {[PARIS.soft, PARIS.hard].map((s) => (
            <div
              key={s}
              className="absolute left-0 w-full border-t border-dashed"
              style={{ bottom: `${pct(s)}%`, borderColor: s === PARIS.hard ? "#FF2E4D" : "#FFB020" }}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-between py-1 text-[11px]">
          <Row label="IL TUO ΔT" value={`${deltaT >= 0 ? "+" : ""}${deltaT.toFixed(1)}°C`} color={level.c} big />
          <Row label="Soglia Parigi (auspicabile)" value="+1.5 °C" color="#FFB020" />
          <Row label="Soglia Parigi (limite)" value="+2.0 °C" color="#FF2E4D" />
          <p className="mt-1 text-[10px] leading-tight text-muted">
            Il riscaldamento che hai vissuto localmente confrontato con i limiti globali
            dell&apos;Accordo di Parigi. Scala 0 → +{max}°C.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line/50 py-1">
      <span className="text-muted">{label}</span>
      <span style={{ color }} className={big ? "text-lg font-bold" : "font-bold"}>{value}</span>
    </div>
  );
}
