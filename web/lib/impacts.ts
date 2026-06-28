import type { Comune, YearPoint } from "./types";

/**
 * MOTORE DI IMPATTO
 * -----------------
 * Calcolo del ΔT personale e traduzione in 4 impatti quotidiani.
 *
 * Regola OSSERVAZIONE vs STIMA:
 *  - se il YearPoint selezionato ha source === "era5" -> usa il dato REALE contato
 *    dal GRIB (badge "◉ OSSERVAZIONE", ciano).
 *  - altrimenti -> proxy lineare derivato dal ΔT (badge "≈ STIMA").
 */

export type ImpactKind = "observation" | "estimate";

export interface ImpactValue {
  label: string;
  value: number;
  unit: string;
  kind: ImpactKind;
  hint: string;
}

export interface DeltaResult {
  deltaT: number;          // ΔT °C (nascita -> anno selezionato, su serie smussata)
  fromYear: number;
  toYear: number;
  point: YearPoint;        // YearPoint dell'anno selezionato
  impacts: ImpactValue[];
}

/** YearPoint piu' vicino all'anno richiesto (la serie e' continua, quindi exact match). */
export function pointForYear(comune: Comune, year: number): YearPoint {
  const clamped = Math.max(
    comune.series[0].year,
    Math.min(year, comune.series[comune.series.length - 1].year)
  );
  return (
    comune.series.find((p) => p.year === clamped) ??
    comune.series[comune.series.length - 1]
  );
}

/**
 * ΔT vissuto: differenza di temperatura media SMUSSATA (media mobile 5y)
 * tra l'anno di nascita e l'anno selezionato sul time-slider.
 */
export function computeDelta(
  comune: Comune,
  birthYear: number,
  toYear: number
): DeltaResult {
  const a = pointForYear(comune, birthYear);
  const b = pointForYear(comune, toYear);
  const deltaT = round1(b.t_mean_smooth - a.t_mean_smooth);

  return {
    deltaT,
    fromYear: a.year,
    toYear: b.year,
    point: b,
    impacts: buildImpacts(deltaT, b),
  };
}

/**
 * Le 4 card. Per i due indicatori "fisici" (notti tropicali, canicola) si usa il
 * dato reale se disponibile (era5), altrimenti il proxy lineare dal ΔT.
 * Costo clima e fabbisogno idrico sono sempre stime percentuali fisse sul ΔT.
 */
export function buildImpacts(deltaT: number, point: YearPoint): ImpactValue[] {
  const isObs = point.source === "era5";
  const d = Math.max(0, deltaT); // impatti definiti per riscaldamento positivo

  const tropical: ImpactValue = isObs
    ? {
        label: "NOTTI TROPICALI",
        value: point.tropical_nights,
        unit: "notti/anno",
        kind: "observation",
        hint: `Tmin > 20°C — contate dal GRIB ERA5 (${point.year})`,
      }
    : {
        label: "NOTTI TROPICALI",
        value: Math.round(d * 12),
        unit: "notti/anno",
        kind: "estimate",
        hint: "Proxy lineare ΔT × 12",
      };

  const heat: ImpactValue = isObs
    ? {
        label: "GIORNI CANICOLA",
        value: point.heat_days,
        unit: "giorni/anno",
        kind: "observation",
        hint: `Tmax > 35°C — contati dal GRIB ERA5 (${point.year})`,
      }
    : {
        label: "GIORNI CANICOLA",
        value: Math.round(d * 8),
        unit: "giorni/anno",
        kind: "estimate",
        hint: "Proxy lineare ΔT × 8",
      };

  const cost: ImpactValue = {
    label: "COSTO CLIMA",
    value: round1(d * 15),
    unit: "% bolletta",
    kind: "estimate",
    hint: "Stima fissa ΔT × 15% (raffrescamento/picchi)",
  };

  const water: ImpactValue = {
    label: "FABBISOGNO IDRICO",
    value: round1(d * 9),
    unit: "% domanda",
    kind: "estimate",
    hint: "Stima fissa ΔT × 9% (evapotraspirazione)",
  };

  return [tropical, cost, heat, water];
}

/** Anomalia di una serie usata dalle warming stripes (vs media 1961-1990 ~ baseline). */
export function stripeAnomaly(comune: Comune): { year: number; anom: number; src: string }[] {
  const base = comune.t_baseline_1961_1990;
  return comune.series.map((p) => ({
    year: p.year,
    anom: round1(p.t_mean - base),
    src: p.source,
  }));
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
