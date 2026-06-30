"use client";
import { useMemo, useState } from "react";
import { COMUNI } from "@/lib/data";

type Metric = "oggi" | "aumento" | "2050";

export default function Ranking({ selected, onSelect }: { selected: string; onSelect: (n: string) => void }) {
  const [metric, setMetric] = useState<Metric>("oggi");

  const rows = useMemo(() => {
    const val = (c: (typeof COMUNI)[number]) =>
      metric === "oggi" ? c.tn_today
      : metric === "2050" ? c.proj_2050.tropical_nights
      : Math.max(0, c.tn_today - c.tn_2011);
    return COMUNI.map((c) => ({ nome: c.nome, quota: c.quota_m, v: val(c) }))
      .sort((a, b) => b.v - a.v);
  }, [metric]);

  const max = Math.max(...rows.map((r) => r.v), 1);
  const labels: Record<Metric, string> = {
    oggi: "Notti afose oggi", aumento: "Aumento dal 2011", "2050": "Notti afose nel 2050",
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate">Ordina per:</p>
        <div className="flex gap-2 text-xs">
          {(["oggi", "aumento", "2050"] as Metric[]).map((m) => (
            <button key={m} onClick={() => setMetric(m)}
              className={`rounded-full border px-3 py-1 ${metric === m ? "border-brand bg-mint text-brand" : "border-[#d6ddcf] text-slate"}`}>
              {labels[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {rows.map((r, i) => {
          const active = r.nome === selected;
          return (
            <button key={r.nome} onClick={() => onSelect(r.nome)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left transition ${active ? "bg-mint" : "hover:bg-cloud/70"}`}>
              <span className="w-5 shrink-0 text-right text-xs text-slate">{i + 1}</span>
              <span className={`w-44 shrink-0 truncate text-sm ${active ? "font-bold text-brand" : "text-ink"}`}>
                {r.nome} <span className="text-[11px] text-slate">{r.quota}m</span>
              </span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-cloud">
                <span className="block h-full rounded-full"
                  style={{ width: `${(r.v / max) * 100}%`, background: active ? "#2E7D43" : "#EE9B3A" }} />
              </span>
              <span className="w-8 shrink-0 text-right text-sm font-semibold text-ink">{r.v}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate">
        Clicca un comune per analizzarlo sopra. Le notti afose (oltre 20°C di notte) dipendono fortemente
        dalla quota: i fondovalle ne hanno molte, i paesi in alta quota ancora poche.
      </p>
    </div>
  );
}
