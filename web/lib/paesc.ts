/** Costanti PAESC distretto + contesto climatico ufficiale citato. */

export const PAESC = {
  baselineYear: 2011,
  baselineTCO2: 512395,
  targetYear: 2030,
  targetTCO2: 295555,
  reductionPct: 42.32,
  // emissioni stimate "ad oggi" (per la progress bar) — sostituire con monitoraggio reale
  currentTCO2: 430120,
};

export interface PaescAction {
  code: string;
  title: string;
  status: "DONE" | "RUN" | "PLAN";
  progress: number; // 0..100
  tco2: number;     // riduzione attesa
}

export const ACTIONS: PaescAction[] = [
  { code: "EE-04", title: "Efficientamento edilizia pubblica 32 comuni", status: "RUN", progress: 58, tco2: 18400 },
  { code: "RES-11", title: "Comunità Energetica Rinnovabile Valcomino", status: "RUN", progress: 41, tco2: 22600 },
  { code: "MOB-07", title: "Piste ciclabili + ricarica EV intercomunale", status: "PLAN", progress: 12, tco2: 9100 },
  { code: "PUB-02", title: "Relamping LED illuminazione pubblica", status: "DONE", progress: 100, tco2: 7300 },
  { code: "AGR-09", title: "Filiera corta + agro-fotovoltaico", status: "PLAN", progress: 8, tco2: 11800 },
  { code: "WAT-05", title: "Riduzione perdite rete idrica -20%", status: "RUN", progress: 33, tco2: 4200 },
  { code: "FOR-01", title: "Riforestazione urbana 24.000 alberi", status: "RUN", progress: 47, tco2: 6900 },
];

export interface ClimateFact {
  src: string;
  text: string;
}

export const FACTS: ClimateFact[] = [
  { src: "COPERNICUS C3S", text: "2024 anno più caldo mai registrato a livello globale: +1.60°C sul livello preindustriale." },
  { src: "MedECC 2020", text: "Il bacino del Mediterraneo si scalda ~20% più velocemente della media globale." },
  { src: "ISPRA Rapporto 44/2023", text: "In Italia 2022: anomalia +1.16°C sulla media climatologica 1991-2020." },
  { src: "COPERNICUS C3S", text: "Le notti tropicali nel Centro Italia sono raddoppiate rispetto agli anni '80." },
  { src: "MedECC", text: "Proiezione: -10/-30% di disponibilità idrica nel Mediterraneo entro fine secolo." },
  { src: "ISPRA", text: "Le ondate di calore estive nelle aree appenniniche sono in aumento di durata e intensità." },
];

export const PARIS = { soft: 1.5, hard: 2.0 };
