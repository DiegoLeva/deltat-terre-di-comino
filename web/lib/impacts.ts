import type { Comune, YearPoint } from "./types";
import { SOURCES } from "./sources";

/**
 * MOTORE ΔT + TRADUTTORE D'IMPATTO
 * --------------------------------
 * 1. computeDelta: di quanto è cresciuta la temperatura media tra un anno
 *    di riferimento (baseline scelta dall'utente / 2011 PAESC / anno di nascita)
 *    e "oggi" (ultimo anno osservato dai dati Copernicus C3S).
 * 2. buildImpacts: traduce il ΔT in conseguenze quotidiane, usando fattori di
 *    conversione da fonti ufficiali (vedi lib/sources.ts). Dove il dato è
 *    realmente osservato dal GRIB (notti tropicali), lo si usa direttamente.
 */

// ---- costanti da fonti ufficiali ----
const SLEEP_MIN_PER_TROPICAL_NIGHT = 12;   // -12 min sonno / notte tropicale (Too hot to sleep, 2024)
const COOLING_KWH_BASE = 1600;             // kWh/anno climatizzazione famiglia tipo (EIA ~1610)
const COOLING_PCT_PER_C = 0.13;            // +13% energia raffrescamento per +1°C (EIA/Climate Central)
const ELEC_PRICE_EUR_KWH = 0.25;           // prezzo medio energia elettrica famiglia (€/kWh)
const IRRIG_PCT_PER_C = 0.06;              // +6% fabbisogno irriguo per +1°C, Mediterraneo (HESS/Carnegie)
const VINE_PCT_PER_C = 0.07;              // vite: +~10% acqua entro 2035-65 (~+1.5°C) -> ~7%/°C (CMCC)
const CROP_YIELD_LOSS_PCT_PER_C = 0.05;    // -5% resa cereali per +1°C (IPCC AR6 / Lobell)
const HOUSEHOLD_WATER_L_YEAR = 78000;      // ~215 L/ab/giorno (ISTAT) ~ uso domestico annuo pro-capite

export interface ImpactValue {
  key: string;
  label: string;
  value: string;       // già formattato
  caption: string;     // sottotitolo esplicativo
  measured: boolean;   // true = dato osservato dai dati C3S, false = stima da fattore ufficiale
  source: { label: string; url: string };
  tone: "warm" | "cool";
}

export interface DeltaResult {
  deltaT: number;
  baselineYear: number;
  todayYear: number;
  tBaseline: number;
  tToday: number;
  pointBaseline: YearPoint;
  pointToday: YearPoint;
  tropicalNightsDelta: number;
  hotDaysDelta: number;
  impacts: ImpactValue[];
}

export function pointForYear(comune: Comune, year: number): YearPoint {
  const lo = comune.series[0].year;
  const hi = comune.series[comune.series.length - 1].year;
  const y = Math.max(lo, Math.min(year, hi));
  return comune.series.find((p) => p.year === y) ?? comune.series[comune.series.length - 1];
}

/** Ultimo anno realmente osservato (source=era5) nei dati = "oggi". */
export function todayYear(comune: Comune): number {
  const obs = comune.series.filter((p) => p.source === "era5");
  return obs.length ? obs[obs.length - 1].year : 2022;
}

export function computeDelta(comune: Comune, baselineYear: number): DeltaResult {
  const today = todayYear(comune);
  const a = pointForYear(comune, baselineYear);
  const b = pointForYear(comune, today);
  const deltaT = round1(b.t_mean_smooth - a.t_mean_smooth);

  const tnDelta = Math.max(0, b.tropical_nights - a.tropical_nights);
  const hdDelta = Math.max(0, b.heat_days - a.heat_days);

  return {
    deltaT,
    baselineYear: a.year,
    todayYear: b.year,
    tBaseline: a.t_mean_smooth,
    tToday: b.t_mean_smooth,
    pointBaseline: a,
    pointToday: b,
    tropicalNightsDelta: tnDelta,
    hotDaysDelta: hdDelta,
    impacts: buildImpacts(deltaT, tnDelta, b),
  };
}

export function buildImpacts(deltaT: number, tropicalNightsDelta: number, today: YearPoint): ImpactValue[] {
  const d = Math.max(0, deltaT);
  const nf = (n: number) => new Intl.NumberFormat("it-IT").format(Math.round(n));

  // 1) SONNO — ancorato al dato reale di notti tropicali quando disponibile
  const tnMeasured = today.source === "era5";
  const tn = tnMeasured ? today.tropical_nights : Math.round(d * 12);
  const sleepHours = (tn * SLEEP_MIN_PER_TROPICAL_NIGHT) / 60;
  const sonno: ImpactValue = {
    key: "sonno",
    label: "Notti senza riposo",
    value: `${tn} notti`,
    caption: `≈ ${sleepHours.toFixed(1)} ore di sonno perse all'anno (−12 min a notte tropicale, Tmin>20°C)`,
    measured: tnMeasured,
    source: { label: SOURCES.sleep.label, url: SOURCES.sleep.url },
    tone: "warm",
  };

  // 2) ENERGIA — climatizzazione
  const extraKwh = COOLING_KWH_BASE * COOLING_PCT_PER_C * d;
  const extraEur = extraKwh * ELEC_PRICE_EUR_KWH;
  const energia: ImpactValue = {
    key: "energia",
    label: "Energia per il fresco",
    value: `+${nf(extraKwh)} kWh`,
    caption: `≈ +${nf(extraEur)} € l'anno per condizionatori e ventilazione (+13% per °C)`,
    measured: false,
    source: { label: SOURCES.eia_ac.label, url: SOURCES.eia_ac.url },
    tone: "warm",
  };

  // 3) ACQUA — irrigazione locale
  const irrigPct = IRRIG_PCT_PER_C * d * 100;
  const extraWaterL = HOUSEHOLD_WATER_L_YEAR * IRRIG_PCT_PER_C * d;
  const acqua: ImpactValue = {
    key: "acqua",
    label: "Acqua in più",
    value: `+${irrigPct.toFixed(0)}%`,
    caption: `fabbisogno irriguo del territorio · ≈ +${nf(extraWaterL)} L/anno per nucleo familiare`,
    measured: false,
    source: { label: SOURCES.hess.label, url: SOURCES.hess.url },
    tone: "warm",
  };

  // 4) CIBO / AGRICOLTURA — vite (vino locale) + rese cereali
  const vinePct = VINE_PCT_PER_C * d * 100;
  const yieldLoss = CROP_YIELD_LOSS_PCT_PER_C * d * 100;
  const cibo: ImpactValue = {
    key: "cibo",
    label: "Campi e vigne sotto stress",
    value: `−${yieldLoss.toFixed(0)}% resa`,
    caption: `cereali a rischio · la vite richiede +${vinePct.toFixed(0)}% acqua (vino della Valcomino)`,
    measured: false,
    source: { label: SOURCES.cmcc.label, url: SOURCES.cmcc.url },
    tone: "warm",
  };

  return [sonno, energia, acqua, cibo];
}

/** Anomalia per le warming stripes (vs baseline climatica 1961-1990 del comune). */
export function stripeAnomaly(comune: Comune) {
  const base = comune.t_baseline_1961_1990;
  return comune.series.map((p) => ({ year: p.year, anom: round1(p.t_mean - base), src: p.source }));
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
