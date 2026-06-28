/** Barra termometro: ΔT confrontato con le soglie dell'Accordo di Parigi. */
export default function Thermometer({ deltaT }: { deltaT: number }) {
  const max = 3;
  const pct = (v: number) => Math.min(100, Math.max(0, (v / max) * 100));
  const label =
    deltaT >= 2 ? { t: "oltre +2°C — soglia critica di Parigi superata", c: "text-warm4" }
    : deltaT >= 1.5 ? { t: "oltre +1.5°C — limite auspicato di Parigi superato", c: "text-warm3" }
    : { t: "sotto +1.5°C", c: "text-brand" };

  return (
    <div>
      <div className="relative h-4 w-full overflow-hidden rounded-full heat-track">
        {/* marcatore ΔT */}
        <div className="absolute top-1/2 h-7 w-1.5 -translate-y-1/2 rounded bg-ink shadow"
             style={{ left: `calc(${pct(deltaT)}% - 3px)` }} />
        {/* soglie Parigi */}
        {[1.5, 2].map((s) => (
          <div key={s} className="absolute top-0 h-full w-px bg-ink/40" style={{ left: `${pct(s)}%` }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-slate">
        <span>0°C</span>
        <span>+1.5°C</span>
        <span>+2°C</span>
        <span>+3°C</span>
      </div>
      <p className={`mt-2 text-sm font-semibold ${label.c}`}>Il tuo ΔT è {label.t}.</p>
    </div>
  );
}
