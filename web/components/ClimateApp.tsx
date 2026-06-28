"use client";
import { useEffect, useState, useCallback } from "react";
import { COMUNI_NAMES, TODAY_YEAR, YEAR_MIN, getComune } from "@/lib/data";
import type { ImpactValue } from "@/lib/impacts";
import ImpactCard from "./ImpactCard";
import Thermometer from "./Thermometer";
import SeriesPanel from "./SeriesPanel";
import WarmingStripes from "./WarmingStripes";
import GisMap from "./GisMap";

interface DeltaApi {
  comune: string;
  baselineYear: number;
  todayYear: number;
  deltaT_c: number;
  tBaseline_c: number;
  tToday_c: number;
  tropicalNightsDelta: number;
  impacts: ImpactValue[];
}

async function fetchDelta(comune: string, baseline: number): Promise<DeltaApi> {
  const r = await fetch(`/api/delta?comune=${encodeURIComponent(comune)}&baseline=${baseline}`);
  if (!r.ok) throw new Error("api");
  return r.json();
}

const heatColor = (d: number) =>
  d >= 2 ? "#C81D25" : d >= 1.5 ? "#E4572E" : d >= 0.8 ? "#F39237" : "#135B4C";

export default function ClimateApp() {
  const [comune, setComune] = useState("Cassino");
  const [baseline, setBaseline] = useState(1990);
  const [res, setRes] = useState<DeltaApi | null>(null);
  const [loading, setLoading] = useState(false);

  const [birth, setBirth] = useState(1985);
  const [birthRes, setBirthRes] = useState<DeltaApi | null>(null);
  const [birthLoading, setBirthLoading] = useState(false);

  const runMain = useCallback(async (c: string, b: number) => {
    setLoading(true);
    try { setRes(await fetchDelta(c, b)); } finally { setLoading(false); }
  }, []);

  const runBirth = useCallback(async (c: string, b: number) => {
    setBirthLoading(true);
    try { setBirthRes(await fetchDelta(c, b)); } finally { setBirthLoading(false); }
  }, []);

  useEffect(() => { runMain("Cassino", 1990); }, [runMain]);

  const comuneObj = getComune(comune);

  return (
    <>
      {/* ================= CALCOLATORE PRINCIPALE ================= */}
      <section id="calcolatore" className="section bg-cloud/60">
        <div className="container-x">
          <span className="eyebrow">Calcolatore</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Quanto è cresciuta la temperatura, da un anno a oggi?
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Scegli un comune e l'anno di riferimento. Interroghiamo i dati Copernicus C3S e ti
            mostriamo l'aumento fino al {TODAY_YEAR}, l'ultimo anno osservato.
          </p>

          <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* form */}
            <div className="card h-fit p-6">
              <label className="mb-1 block text-sm font-semibold text-ink">Comune</label>
              <select className="input mb-4 w-full px-3 py-2.5 text-sm" value={comune}
                onChange={(e) => setComune(e.target.value)}>
                {COMUNI_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>

              <label className="mb-1 block text-sm font-semibold text-ink">
                Anno di riferimento: <span className="text-brand">{baseline}</span>
              </label>
              <input type="range" min={YEAR_MIN} max={TODAY_YEAR - 1} value={baseline}
                onChange={(e) => setBaseline(Number(e.target.value))}
                className="mb-1 w-full accent-brand" />
              <div className="mb-4 flex justify-between text-[11px] text-slate">
                <span>{YEAR_MIN}</span><span>2011 PAESC</span><span>{TODAY_YEAR - 1}</span>
              </div>

              <button onClick={() => runMain(comune, baseline)} disabled={loading}
                className="btn-primary w-full px-4 py-3 text-sm disabled:opacity-60">
                {loading ? "Interrogazione dati Copernicus C3S…" : "Calcola l'aumento →"}
              </button>
            </div>

            {/* risultato */}
            <ResultPanel res={res} loading={loading} />
          </div>
        </div>
      </section>

      {/* ================= GRAFICO + STRISCE ================= */}
      <section id="serie" className="section">
        <div className="container-x grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <SeriesPanel comune={comuneObj} />
          <div className="flex flex-col gap-6">
            <WarmingStripes comune={comuneObj} />
            <div className="card p-5">
              <h3 className="font-display text-sm font-bold text-ink">Perché proprio qui?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Il bacino del Mediterraneo si scalda circa il <b className="text-warm3">20% più in fretta</b>
                {" "}della media globale (MedECC 2020). Le Terre di Comino, tra Appennino e valli,
                vedono inverni più miti e ondate di calore estive sempre più lunghe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COM'ERA ALLA TUA NASCITA ================= */}
      <section id="nascita" className="section bg-mint/40">
        <div className="container-x">
          <span className="eyebrow">La tua vita, il tuo clima</span>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-extrabold text-ink md:text-4xl">
            Che clima c'era quando sei nato/a?
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Inserisci il tuo anno di nascita: confrontiamo il clima di allora a {comune} con quello di oggi.
          </p>

          <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="card h-fit p-6">
              <label className="mb-1 block text-sm font-semibold text-ink">Anno di nascita</label>
              <input type="number" min={YEAR_MIN} max={TODAY_YEAR - 1} value={birth}
                onChange={(e) => setBirth(Math.min(TODAY_YEAR - 1, Math.max(YEAR_MIN, Number(e.target.value) || YEAR_MIN)))}
                className="input mb-4 w-full px-3 py-2.5 text-sm" />
              <p className="mb-4 text-xs text-slate">Comune: <b className="text-ink">{comune}</b> (cambialo nel calcolatore sopra)</p>
              <button onClick={() => runBirth(comune, birth)} disabled={birthLoading}
                className="btn-primary w-full px-4 py-3 text-sm disabled:opacity-60">
                {birthLoading ? "Calcolo…" : "Confronta nascita → oggi →"}
              </button>
            </div>

            <div>
              {birthRes && !birthLoading && (
                <div className="card mb-6 p-6">
                  <p className="text-lg leading-relaxed text-ink">
                    Quando sei nato/a nel <b>{birthRes.baselineYear}</b>, a <b>{comune}</b> la
                    temperatura media era <b className="text-brand">{birthRes.tBaseline_c}°C</b>.
                    Oggi ({birthRes.todayYear}) è <b style={{ color: heatColor(birthRes.deltaT_c) }}>
                    {birthRes.tToday_c}°C</b>: nell'arco della tua vita è cresciuta di{" "}
                    <b style={{ color: heatColor(birthRes.deltaT_c) }}>
                      +{birthRes.deltaT_c.toFixed(1)}°C
                    </b>.
                  </p>
                </div>
              )}
              <ResultPanel res={birthRes} loading={birthLoading} hideHeadline />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAPPA ================= */}
      <section id="mappa" className="section">
        <div className="container-x">
          <span className="eyebrow">Territorio</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">
            I 32 comuni del distretto
          </h2>
          <p className="mt-3 max-w-2xl text-slate">
            Stessa cella satellitare, quote diverse: la mappa evidenzia il comune selezionato.
          </p>
          <div className="mt-7"><GisMap selected={comune} /></div>
        </div>
      </section>
    </>
  );
}

/* ---- pannello risultato riusato dai due calcolatori ---- */
function ResultPanel({ res, loading, hideHeadline }: { res: DeltaApi | null; loading: boolean; hideHeadline?: boolean }) {
  if (loading) {
    return <div className="card grid h-64 place-items-center text-slate">Interrogazione dati Copernicus C3S…</div>;
  }
  if (!res) {
    return <div className="card grid h-64 place-items-center text-slate">Premi “Calcola” per vedere il risultato.</div>;
  }
  const col = heatColor(res.deltaT_c);
  return (
    <div>
      {!hideHeadline && (
        <div className="card mb-6 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate">
                {res.comune} · dal {res.baselineYear} al {res.todayYear}
              </p>
              <p className="font-display text-6xl font-extrabold leading-none" style={{ color: col }}>
                +{res.deltaT_c.toFixed(1)}<span className="text-3xl text-slate"> °C</span>
              </p>
              <p className="mt-1 text-sm text-slate">
                da {res.tBaseline_c}°C a {res.tToday_c}°C di temperatura media annua
              </p>
            </div>
            <div className="w-full max-w-xs"><Thermometer deltaT={res.deltaT_c} /></div>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {res.impacts.map((imp) => <ImpactCard key={imp.key} impact={imp} />)}
      </div>
      <p className="mt-3 text-xs text-slate">
        Le card “stima” derivano dal ΔT con fattori da fonti ufficiali (clicca le fonti). Le card
        “dato osservato” sono conteggi reali dai dati Copernicus C3S.
      </p>
    </div>
  );
}
