import type { ImpactValue } from "@/lib/impacts";

export default function ImpactCard({ impact }: { impact: ImpactValue }) {
  const obs = impact.kind === "observation";
  return (
    <div className="panel corner relative overflow-hidden p-3">
      {/* gradiente anomalia su bordo sinistro */}
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{
          background: obs
            ? "linear-gradient(180deg,#00E5C7,#0A8A7A)"
            : "linear-gradient(180deg,#FFB020,#FF7A18,#FF2E4D)",
        }}
      />
      <div className="flex items-center justify-between">
        <span className="hatch">{impact.label}</span>
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-widest ${
            obs
              ? "bg-cyan/10 text-cyan"
              : "bg-amber/10 text-amber"
          }`}
        >
          {obs ? "◉ OSSERVAZIONE" : "≈ STIMA"}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: obs ? "#00E5C7" : "#FF7A18" }}
        >
          {impact.value}
        </span>
        <span className="text-[11px] text-muted">{impact.unit}</span>
      </div>

      <p className="mt-1 text-[10px] leading-tight text-muted">{impact.hint}</p>
    </div>
  );
}
