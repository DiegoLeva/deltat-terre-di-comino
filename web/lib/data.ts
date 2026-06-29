import type { ClimateData, Comune } from "./types";
import raw from "@/public/data/climate_data.json";

export const CLIMATE = raw as unknown as ClimateData;
export const META = CLIMATE.meta;

export const COMUNI: Comune[] = [...CLIMATE.comuni].sort((a, b) => a.nome.localeCompare(b.nome, "it"));
export const COMUNI_NAMES = COMUNI.map((c) => c.nome);

export function getComune(nome: string): Comune {
  return CLIMATE.comuni.find((c) => c.nome === nome) ?? CLIMATE.comuni[0];
}

export const TODAY_YEAR = CLIMATE.comuni[0]?.today_year ?? META.obs_end;
export const YEAR_MIN = META.year_start;
export const PAESC = META.paesc;
