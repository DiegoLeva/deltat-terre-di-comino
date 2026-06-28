"use client";
import { PAESC } from "@/lib/paesc";
import ActionTracker from "./ActionTracker";

export default function PaescTelemetry() {
  const { baselineTCO2, targetTCO2, currentTCO2, reductionPct } = PAESC;

  // posizione corrente nella forbice baseline -> target
  const span = baselineTCO2 - targetTCO2;
  const done = baselineTCO2 - currentTCO2;
  const pctToTarget = Math.min(100, Math.max(0, (done / span) * 100));
  const cutPct = ((baselineTCO2 - currentTCO2) / baselineTCO2) * 100;

  const fmt = (n: number) => n.toLocaleString("it");

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <div className="panel corner p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="hatch">TELEMETRIA EMISSIONI // DISTRETTO</span>
          <span className="hatch text-cyandim">tCO₂</span>
        </div>

        <div className="flex items-end justify-between text-[11px]">
          <div>
            <div className="text-muted">BASELINE {PAESC.baselineYear}</div>
            <div className="text-lg font-bold text-ink">{fmt(baselineTCO2)}</div>
          </div>
          <div className="text-center">
            <div className="text-muted">ATTUALE</div>
            <div className="text-lg font-bold text-amber">{fmt(currentTCO2)}</div>
          </div>
          <div className="text-right">
            <div className="text-muted">TARGET {PAESC.targetYear}</div>
            <div className="text-lg font-bold text-cyan">{fmt(targetTCO2)}</div>
          </div>
        </div>

        {/* progress bar */}
        <div className="relative mt-4 h-4 w-full overflow-hidden rounded-sm bg-grid">
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: `${pctToTarget}%`,
              background: "linear-gradient(90deg,#7CFF6B,#00E5C7)",
            }}
          />
          {/* marker target */}
          <div className="absolute right-0 top-0 h-full w-[2px] bg-cyan" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-bg mix-blend-difference">
            {pctToTarget.toFixed(0)}% del taglio richiesto
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px]">
          <span className="text-muted">
            Riduzione attuale <span className="font-bold text-amber">−{cutPct.toFixed(1)}%</span>
          </span>
          <span className="text-muted">
            Obiettivo <span className="font-bold text-cyan">−{reductionPct}%</span> @ 2030
          </span>
        </div>
      </div>

      <ActionTracker />
    </div>
  );
}
