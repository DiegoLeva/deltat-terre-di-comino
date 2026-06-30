"use client";
import type { Comune } from "@/lib/types";

export default function Projection2050({ comune: c }: { comune: Comune }) {
  const p = c.proj_2050;
  const tnNow = c.tn_today;
  const tn50 = p.tropical_nights;
  const maxTn = Math.max(tn50, tnNow, 10);

  return (
    <div className="card p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-base leading-relaxed text-ink/85">
            Se il riscaldamento continua a questo ritmo, nel <b>2050</b> a <b>{c.nome}</b> la temperatura
            media salirà a circa <b style={{ color: "#E4572E" }}>{p.t_mean}°C</b>, cioè{" "}
            <b style={{ color: "#E4572E" }}>+{p.delta_today.toFixed(1)}°C</b> rispetto a oggi.
            {tn50 > tnNow ? (
              <> Le notti afose passerebbero da <b>{tnNow}</b> a <b style={{ color: "#E4572E" }}>{tn50}</b> all'anno.</>
            ) : (
              <> Anche in quota, dove oggi le notti afose sono rare, il caldo notturno inizierà a farsi sentire.</>
            )}
          </p>
          <p className="mt-3 inline-block rounded-full bg-cloud px-3 py-1 text-xs text-slate">
            ⚠︎ Scenario indicativo a emissioni elevate (proiezione del trend osservato), non una previsione certa.
          </p>
        </div>

        {/* confronto notti oggi vs 2050 */}
        <div className="rounded-2xl border border-[#e6e9df] bg-cloud/40 p-5">
          <p className="mb-3 text-sm font-semibold text-slate">Notti afose all'anno</p>
          {[
            { label: "oggi", v: tnNow, col: "#EE9B3A" },
            { label: "2050", v: tn50, col: "#C81D25" },
          ].map((row) => (
            <div key={row.label} className="mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate">{row.label}</span>
                <span className="font-display font-bold" style={{ color: row.col }}>{row.v}</span>
              </div>
              <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full" style={{ width: `${(row.v / maxTn) * 100}%`, background: row.col }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
