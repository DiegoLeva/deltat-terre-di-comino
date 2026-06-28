"use client";
import { useMemo, useState } from "react";
import { getComune } from "@/lib/data";
import { computeDelta } from "@/lib/impacts";
import TimeMachine, { type TMState } from "@/components/TimeMachine";
import HUD from "@/components/HUD";
import SeriesPanel from "@/components/SeriesPanel";
import PaescTelemetry from "@/components/PaescTelemetry";
import DataTicker from "@/components/DataTicker";
import ClimateBriefing from "@/components/ClimateBriefing";
import GisMap from "@/components/GisMap";

const INITIAL: TMState = { comune: "Cassino", birthYear: 1990, year: 2022 };

export default function Page() {
  const [state, setState] = useState<TMState>(INITIAL);

  const comune = useMemo(() => getComune(state.comune), [state.comune]);
  const delta = useMemo(
    () => computeDelta(comune, state.birthYear, state.year),
    [comune, state.birthYear, state.year]
  );

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-4">
      {/* TOP BAR */}
      <header className="panel mb-3 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-cyan" style={{ textShadow: "0 0 14px #00E5C7" }}>ΔT</span>
          <span className="text-[11px] tracking-widest text-ink">
            TERRE DI COMINO SMART LAND <span className="text-muted">// CLIMATE TELEMETRY v1.0</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted">
          <span className="h-2 w-2 animate-blink rounded-full bg-lime" />
          ERA5 · PAESC · 32 COMUNI · {new Date().getUTCFullYear()}
        </div>
      </header>

      {/* LIVE FEED */}
      <div className="mb-3">
        <DataTicker />
      </div>

      {/* GRID PRINCIPALE */}
      <div className="grid grid-cols-12 gap-3">
        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3">
          <TimeMachine initial={INITIAL} onApply={setState} />
        </div>

        {/* CENTRO */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-6">
          <HUD comune={comune} birthYear={state.birthYear} toYear={state.year} />
          <SeriesPanel comune={comune} />
          <PaescTelemetry />
        </div>

        {/* DESTRA */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-3">
          <ClimateBriefing deltaT={delta.deltaT} />
          <GisMap selected={state.comune} />
        </div>
      </div>

      <footer className="mt-4 border-t border-line pt-3 text-[10px] text-muted">
        Fonti: ECMWF Copernicus C3S (ERA5) · ISPRA Rapporto 44 · MedECC · PAESC distretto Terre di Comino.
        Dati downscalati per quota (lapse-rate −6.5°C/km). Le card &ldquo;≈ STIMA&rdquo; sono proxy lineari del ΔT,
        non misure dirette.
      </footer>
    </main>
  );
}
