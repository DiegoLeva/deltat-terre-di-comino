import type { ClimateData, Comune } from "./types";
import raw from "@/public/data/climate_data.json";

export const CLIMATE = raw as unknown as ClimateData;

/** Tutti i 32 comuni, ordinati alfabeticamente per la tendina. */
export const COMUNI: Comune[] = [...CLIMATE.comuni].sort((a, b) =>
  a.nome.localeCompare(b.nome, "it")
);
export const COMUNI_NAMES = COMUNI.map((c) => c.nome);

export function getComune(nome: string): Comune {
  return CLIMATE.comuni.find((c) => c.nome === nome) ?? CLIMATE.comuni[0];
}

/** Anno "oggi" globale = ultimo anno osservato C3S presente nei dati. */
export const TODAY_YEAR = (() => {
  const obs = CLIMATE.comuni[0].series.filter((p) => p.source === "era5");
  return obs.length ? obs[obs.length - 1].year : 2022;
})();

export const YEAR_MIN = CLIMATE.meta.year_start;       // 1950
export const PAESC_BASELINE_YEAR = CLIMATE.meta.paesc.baseline_year; // 2011
export const PAESC = CLIMATE.meta.paesc;
