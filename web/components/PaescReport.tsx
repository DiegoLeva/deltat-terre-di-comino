import { CLIMATE, PAESC, TODAY_YEAR } from "@/lib/data";

/** Resoconto dal 2011 (baseline PAESC): riscaldamento medio del distretto + emissioni. */
export default function PaescReport() {
  // ΔT medio del distretto dal 2011 a oggi
  const deltas = CLIMATE.comuni.map((c) => {
    const get = (y: number) => c.series.find((p) => p.year === y)?.t_mean_smooth ?? 0;
    return get(TODAY_YEAR) - get(2011);
  });
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

  // notti tropicali medie 2011 vs oggi
  const tnNow = avg(CLIMATE.comuni.map((c) => c.series.find((p) => p.year === TODAY_YEAR)?.tropical_nights ?? 0));
  const tn2011 = avg(CLIMATE.comuni.map((c) => c.series.find((p) => p.year === 2011)?.tropical_nights ?? 0));

  const fmt = (n: number) => new Intl.NumberFormat("it-IT").format(Math.round(n));
  const span = PAESC.baseline_tco2 - PAESC.target_tco2;
  const current = 430120; // emissioni stimate ad oggi (da monitoraggio PAESC; placeholder)
  const progress = Math.min(100, Math.max(0, ((PAESC.baseline_tco2 - current) / span) * 100));

  return (
    <section id="paesc" className="section bg-cloud/60">
      <div className="container-x">
        <span className="eyebrow">Il piano per il clima del distretto · dal 2011</span>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
          Dieci anni di PAESC: dove siamo
        </h2>
        <p className="mt-3 max-w-2xl text-slate">
          Il 2011 è l'anno di riferimento del Piano d'Azione per l'Energia Sostenibile e il Clima
          del distretto. Da allora, due numeri raccontano la sfida: il clima che cambia e le
          emissioni da tagliare.
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {/* clima dal 2011 */}
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-ink">Il clima dal 2011</h3>
            <p className="mt-4 font-display text-5xl font-extrabold text-warm3">
              +{avgDelta.toFixed(1)}°C
            </p>
            <p className="mt-1 text-sm text-slate">
              temperatura media del distretto, 2011 → {TODAY_YEAR} (media dei 32 comuni)
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-center">
              <Stat big={`${Math.round(tn2011)}`} small="notti tropicali nel 2011" />
              <Stat big={`${Math.round(tnNow)}`} small={`notti tropicali nel ${TODAY_YEAR}`} accent />
            </div>
          </div>

          {/* emissioni */}
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-ink">Le emissioni da tagliare</h3>
            <div className="mt-4 flex items-end justify-between text-sm">
              <div><div className="text-slate">Baseline 2011</div><div className="font-display text-xl font-bold text-ink">{fmt(PAESC.baseline_tco2)}</div></div>
              <div className="text-center"><div className="text-slate">Oggi (stima)</div><div className="font-display text-xl font-bold text-warm2">{fmt(current)}</div></div>
              <div className="text-right"><div className="text-slate">Target 2030</div><div className="font-display text-xl font-bold text-brand">{fmt(PAESC.target_tco2)}</div></div>
            </div>
            <div className="relative mt-4 h-4 overflow-hidden rounded-full bg-cloud">
              <div className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-accent to-brand"
                   style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate">
              Obiettivo: <b className="text-brand">−{PAESC.target_reduction_pct}%</b> di CO₂ tCO₂ entro il
              2030 ({fmt(span)} tCO₂ da tagliare). Completato finora: <b>{progress.toFixed(0)}%</b>.
            </p>
            <p className="mt-1 text-[11px] text-slate/80">tCO₂ = tonnellate di anidride carbonica equivalente.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ big, small, accent }: { big: string; small: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-cloud/70 p-3">
      <div className={`font-display text-2xl font-extrabold ${accent ? "text-warm3" : "text-ink"}`}>{big}</div>
      <div className="text-[11px] text-slate">{small}</div>
    </div>
  );
}

const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
