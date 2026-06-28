import type { ClimateData, Comune } from "./types";
import raw from "@/public/data/climate_data.json";

export const CLIMATE = raw as unknown as ClimateData;

/** Mock ridotto richiesto per la dropdown: Ripi, Alvito, Cassino, Frosinone. */
export const MOCK_COMUNI = ["Ripi", "Alvito", "Cassino", "Frosinone"];

export function getComune(nome: string): Comune {
  return (
    CLIMATE.comuni.find((c) => c.nome === nome) ??
    CLIMATE.comuni.find((c) => MOCK_COMUNI.includes(c.nome)) ??
    CLIMATE.comuni[0]
  );
}

export const ALL_COMUNI = CLIMATE.comuni.map((c) => c.nome);
