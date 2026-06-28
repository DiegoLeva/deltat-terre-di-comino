"use client";
import { useState } from "react";
import { MOCK_COMUNI } from "@/lib/data";

export interface TMState {
  comune: string;
  birthYear: number;
  year: number;
}

/** Sidebar Time-Machine. Mantiene un draft; "CALCOLA ΔT" applica lo stato al padre. */
export default function TimeMachine({
  initial,
  onApply,
}: {
  initial: TMState;
  onApply: (s: TMState) => void;
}) {
  const [comune, setComune] = useState(initial.comune);
  const [birthYear, setBirthYear] = useState(initial.birthYear);
  const [year, setYear] = useState(initial.year);

  const MIN = birthYear;
  const MAX = 2030;

  return (
    <aside className="panel corner flex h-full flex-col gap-5 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-cyan" style={{ textShadow: "0 0 14px #00E5C7" }}>ΔT</span>
          <div className="leading-tight">
            <div className="text-[11px] font-bold tracking-widest text-ink">TERRE DI COMINO</div>
            <div className="hatch">SMART LAND · CLIMATE TELEMETRY</div>
          </div>
        </div>
        <div className="mt-3 h-px w-full bg-line" />
      </div>

      {/* dropdown comune */}
      <Field label="COMUNE // 32 NODI">
        <select
          value={comune}
          onChange={(e) => setComune(e.target.value)}
          className="w-full rounded-sm border border-line bg-bg px-2 py-2 text-sm text-cyan outline-none focus:border-cyan"
        >
          {MOCK_COMUNI.map((c) => (
            <option key={c} value={c} className="bg-bg text-ink">{c}</option>
          ))}
        </select>
        <p className="mt-1 text-[9px] text-muted">mock ridotto · dataset completo = 32 comuni</p>
      </Field>

      {/* anno di nascita */}
      <Field label="ANNO DI NASCITA">
        <input
          type="number"
          min={1950}
          max={2025}
          value={birthYear}
          onChange={(e) => {
            const v = Math.min(2025, Math.max(1950, Number(e.target.value) || 1950));
            setBirthYear(v);
            if (year < v) setYear(v);
          }}
          className="w-full rounded-sm border border-line bg-bg px-2 py-2 text-sm text-cyan outline-none focus:border-cyan"
        />
      </Field>

      {/* time slider */}
      <Field label={`TIME-SLIDER // ${year}`}>
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="deltat-slider w-full"
          style={{
            accentColor: year > 2025 ? "#FFB020" : "#00E5C7",
          }}
        />
        <div className="mt-1 flex justify-between text-[9px] text-muted">
          <span>{MIN} (nascita)</span>
          <span className={year > 2025 ? "text-amber" : "text-cyandim"}>
            {year > 2025 ? "▸ PROIEZIONE" : "OSSERVATO/BACKCAST"}
          </span>
          <span>2030</span>
        </div>
      </Field>

      <button
        onClick={() => onApply({ comune, birthYear, year })}
        className="group mt-auto rounded-sm border border-cyan bg-cyan/10 px-3 py-3 text-sm font-bold tracking-widest text-cyan transition hover:bg-cyan hover:text-bg"
      >
        ▶ CALCOLA ΔT
      </button>

      <div className="hatch text-center text-muted">
        ERA5 t2m · LAPSE −6.5°C/km · MA-5y
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="hatch mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
