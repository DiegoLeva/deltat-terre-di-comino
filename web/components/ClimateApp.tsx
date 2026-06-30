"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { COMUNI_NAMES, TODAY_YEAR, YEAR_MIN, getComune, META } from "@/lib/data";
import { MESI_LONG } from "@/lib/types";
import type { ImpactValue } from "@/lib/impacts";
import ImpactCard from "./ImpactCard";
import Thermometer from "./Thermometer";
import MonthlyChart from "./MonthlyChart";
import WarmingStripes from "./WarmingStripes";
import SeriesPanel from "./SeriesPanel";
import BirthDay from "./BirthDay";
import Projection2050 from "./Projection2050";
import Ranking from "./Ranking";
import ShareCard from "./ShareCard";
import GisMap from "./GisMap";

interface DeltaApi {
  comune: string; baselineYear: number; todayYear: number; deltaT_c: number;
  tBaseline_c: number; tToday_c: number; tropicalNightsDelta: number; impacts: ImpactValue[];
}
const fetchDelta = (c: string, b: number) =>
  fetch(`/api/delta?comune=${encodeURIComponent(c)}&baseline=${b}`).then((r) => r.json() as Promise<DeltaApi>);

const heat = (d: number) => (d >= 2 ? "#C81D25" : d >= 1.5 ? "#E4572E" : d >= 0.8 ? "#EE9B3A" : "#2E7D43");

export default function ClimateApp() {
  const [comune, setComune] = useState("Atina");
  const [baseline, setBaseline] = useState(2011);
  const [res, setRes] = useState<DeltaApi | null>(null);
  const [loading, setLoading] = useState(false);

  const c = useMemo(() => getComune(comune), [comune]);
  const m = c.monthly;
  const meseMax = MESI_LONG[(m.scarto_max.m || 1) - 1];

  const run = useCallback(async (cn: string, b: number) => {
    setLoading(true);
    try { setRes(await fetchDelta(cn, b)); } finally { setLoading(false); }
  }, []);
  useEffect(() => { run(comune, baseline); }, [comune, baseline, run]);

  return (
    <>
      {/* ============ ESPLORA COMUNE ============ */}
      <section id="esplora" className="section">
        <div className="container-x">
          <span className="eyebrow">Esplora · I comuni del PAESC</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Cerca il tuo comune
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-ink">Comune:</label>
            <select value={comune} onChange={(e) => setComune(e.target.value)}
              className="input min-w-[260px] px-3 py-2.5 text-sm font-medium">
              {COMUNI_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-sm text-slate">{c.quota_m} m s.l.m.</span>
          </div>

          {/* headline */}
          <div className="mt-7 grid gap-6 lg:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-semibold text-slate">Quanto fa più caldo</p>
              <p className="mt-1 font-display text-5xl font-extrabold text-warm3">
                +{m.scarto_medio.toFixed(1)}°C
              </p>
              <p className="mt-2 text-sm text-slate">
                in media nell'anno, rispetto al clima di 60 anni fa (1961-1990)
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold text-slate">Il mese più cambiato</p>
              <p className="mt-1 font-display text-3xl font-extrabold capitalize text-ink">{meseMax}</p>
              <p className="mt-1 font-display text-2xl font-bold text-warm3">+{m.scarto_max.value.toFixed(1)}°C</p>
              <p className="mt-2 text-sm text-slate">il mese che si è scaldato di più</p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold text-slate">Notti senza riposo</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-ink">
                {c.tn_2011} <span className="text-slate">→</span> <span className="text-warm3">{c.tn_today}</span>
              </p>
              <p className="mt-2 text-sm text-slate">notti afose all'anno (oltre 20°C di notte), dal 2011 a oggi</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <MonthlyChart monthly={m} />
            <WarmingStripes comune={c} />
          </div>

          {/* editoriale dinamico */}
          <div className="mt-6 card p-6">
            <p className="text-base leading-relaxed text-ink/85">
              A <b>{c.nome}</b> ({c.quota_m} metri di altitudine) il caldo in più si sente soprattutto in{" "}
              <b className="capitalize">{meseMax}</b>, con <b>+{m.scarto_max.value.toFixed(1)}°C</b>{" "}
              rispetto al clima del 1961-1990. L'aumento è simile in tutti i paesi del distretto; quello
              che cambia davvero da un paese all'altro è <b>quanto caldo fa in assoluto</b>, e dipende
              dall'altitudine. Le notti afose — quelle in cui non si scende sotto i 20°C e si dorme male —
              qui sono passate da <b>{c.tn_2011}</b> a <b>{c.tn_today}</b> all'anno. Come in tutta Italia,
              sono i paesi più alti e freddi dell'Appennino a scaldarsi più in fretta.
            </p>
          </div>

          <div className="mt-6"><ShareCard comune={c} /></div>
        </div>
      </section>

      {/* ============ NEL 2050 ============ */}
      <section id="futuro" className="section bg-cream/50">
        <div className="container-x">
          <span className="eyebrow">Uno sguardo al futuro</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            E nel 2050, se non cambia nulla?
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Proiettando in avanti il riscaldamento già osservato, ecco che clima potrebbe avere {comune}
            {" "}fra venticinque anni.
          </p>
          <div className="mt-6"><Projection2050 comune={c} /></div>
        </div>
      </section>

      {/* ============ CLASSIFICA ============ */}
      <section id="classifica" className="section">
        <div className="container-x">
          <span className="eyebrow">La classifica</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Dove si soffre di più il caldo di notte
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            I 32 comuni del distretto a confronto. Tocca un comune per analizzarlo in dettaglio.
          </p>
          <div className="mt-6"><Ranking selected={comune} onSelect={setComune} /></div>
        </div>
      </section>

      {/* ============ SERIE STORICA ============ */}
      <section className="section bg-cream/50">
        <div className="container-x">
          <span className="eyebrow">La serie storica</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Sessant'anni di temperature, a {c.nome}
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            La temperatura media annua, con le osservazioni Copernicus {META.obs_start}–{META.obs_end} e la
            ricostruzione del contesto storico. La striscia qui sopra riassume lo stesso dato a colori.
          </p>
          <div className="mt-6"><SeriesPanel comune={c} /></div>
        </div>
      </section>

      {/* ============ COSA COMPORTA ============ */}
      <section id="cosa-comporta" className="section">
        <div className="container-x">
          <span className="eyebrow">Cosa comporta</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Anche pochi gradi cambiano la vita di tutti i giorni
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Scegli da quale anno partire: a {c.nome}, ecco quanto è cresciuta la temperatura fino al{" "}
            {TODAY_YEAR} e cosa significa per sonno, energia, acqua e cibo.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label className="text-sm font-semibold text-ink">
              Dal: <span className="text-brand">{baseline}</span>
            </label>
            <input type="range" min={YEAR_MIN} max={TODAY_YEAR - 1} value={baseline}
              onChange={(e) => setBaseline(Number(e.target.value))}
              className="w-64 accent-[#2E7D43]" />
            <div className="flex gap-2 text-xs">
              {[1961, 1990, 2011].map((y) => (
                <button key={y} onClick={() => setBaseline(y)}
                  className={`rounded-full border px-3 py-1 ${baseline === y ? "border-brand bg-mint text-brand" : "border-[#d6ddcf] text-slate"}`}>
                  {y === 2011 ? "2011 (PAESC)" : y}
                </button>
              ))}
            </div>
          </div>

          {res && !loading && (
            <div className="mt-6 card p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate">{c.nome} · dal {res.baselineYear} al {res.todayYear}</p>
                  <p className="font-display text-6xl font-extrabold leading-none" style={{ color: heat(res.deltaT_c) }}>
                    +{res.deltaT_c.toFixed(1)}<span className="text-3xl text-slate"> °C</span>
                  </p>
                  <p className="mt-1 text-sm text-slate">da {res.tBaseline_c}°C a {res.tToday_c}°C di media annua</p>
                </div>
                <div className="w-full max-w-xs"><Thermometer deltaT={res.deltaT_c} /></div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(res?.impacts ?? []).map((imp) => <ImpactCard key={imp.key} impact={imp} />)}
          </div>
          <p className="mt-3 text-xs text-slate">
            Le schede “dato osservato” sono conteggi reali dai satelliti; le “stima” sono calcolate
            dall'aumento di temperatura usando dati ufficiali (clicca le fonti).
          </p>
        </div>
      </section>

      {/* ============ IL GIORNO IN CUI SEI NATO ============ */}
      <section id="nascita" className="section bg-cream/50">
        <div className="container-x">
          <span className="eyebrow">Il giorno in cui sei nato</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Che tempo faceva il giorno della tua nascita?
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Scegli la tua data: confrontiamo la minima e la massima di quel giorno a {comune} con lo
            stesso giorno di oggi. (Per cambiare paese usa il menu in alto.)
          </p>
          <div className="mt-6"><BirthDay slug={c.slug} nome={c.nome} /></div>
        </div>
      </section>

      {/* ============ MAPPA ============ */}
      <section id="mappa" className="section">
        <div className="container-x">
          <span className="eyebrow">Territorio</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">I 32 comuni</h2>
          <p className="mt-3 max-w-2xl text-slate">
            Risoluzione dei dati ~25 km: in montagna più comuni condividono la stessa cella, distinti per
            quota con il downscaling altimetrico. La mappa evidenzia il comune selezionato.
          </p>
          <div className="mt-6"><GisMap selected={comune} /></div>
        </div>
      </section>
    </>
  );
}
