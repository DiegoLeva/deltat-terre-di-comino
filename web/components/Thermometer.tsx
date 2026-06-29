/** Barra: l'aumento di temperatura confrontato con i limiti dell'Accordo di Parigi. */
export default function Thermometer({ deltaT }: { deltaT: number }) {
  const max = 3;
  const pct = (v: number) => Math.min(100, Math.max(0, (v / max) * 100));
  const label =
    deltaT >= 2 ? { t: "oltre +2°C — il limite più pericoloso fissato a Parigi", c: "text-warm4" }
    : deltaT >= 1.5 ? { t: "oltre +1,5°C — la soglia di sicurezza di Parigi è già superata", c: "text-warm3" }
    : { t: "ancora sotto +1,5°C, la soglia di sicurezza di Parigi", c: "text-brand" };

  return (
    <div>
      <div className="relative h-4 w-full overflow-hidden rounded-full heat-track">
        <div className="absolute top-1/2 h-7 w-1.5 -translate-y-1/2 rounded bg-ink shadow"
             style={{ left: `calc(${pct(deltaT)}% - 3px)` }} />
        {[1.5, 2].map((s) => (
          <div key={s} className="absolute top-0 h-full w-px bg-ink/40" style={{ left: `${pct(s)}%` }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-slate">
        <span>oggi come prima</span>
        <span>+1,5°C</span>
        <span>+2°C</span>
        <span>+3°C</span>
      </div>
      <p className={`mt-2 text-sm font-semibold ${label.c}`}>L'aumento qui è {label.t}.</p>
    </div>
  );
}
