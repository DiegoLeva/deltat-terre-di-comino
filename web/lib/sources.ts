/** Fonti ufficiali citate negli impatti. Riferite dalle card per trasparenza. */
export interface Source {
  id: string;
  label: string;
  url: string;
}

export const SOURCES: Record<string, Source> = {
  c3s: { id: "c3s", label: "Copernicus Climate Change Service (ERA5)", url: "https://cds.climate.copernicus.eu/datasets" },
  ispra_tn: { id: "ispra_tn", label: "ISPRA — Indicatore Notti Tropicali", url: "https://indicatoriambientali.isprambiente.it/it/clima/notti-tropicali" },
  sleep: { id: "sleep", label: "Minor & al., «Too hot to sleep» (Science of the Total Environment, 2024)", url: "https://www.sciencedirect.com/science/article/pii/S0095069624001372" },
  eia_ac: { id: "eia_ac", label: "U.S. EIA — Air conditioning electricity use", url: "https://www.eia.gov/todayinenergy/detail.php?id=31312" },
  climate_central: { id: "climate_central", label: "Climate Central — Hotter Climate, Higher Cooling Demand", url: "https://www.climatecentral.org/climate-matters/hotter-climate-higher-cooling-demand-2023" },
  hess: { id: "hess", label: "HESS / Copernicus — Mediterranean irrigation under climate change", url: "https://hess.copernicus.org/articles/20/953/2016/" },
  cmcc: { id: "cmcc", label: "CMCC — Climate and agriculture in the Mediterranean", url: "https://www.cmcc.it/article/climate-and-agriculture-in-the-mediterranean-less-water-resource-more-irrigation-demand" },
  medecc: { id: "medecc", label: "MedECC 2020 — Mediterranean Basin assessment", url: "https://www.medecc.org/medecc-reports/" },
  ipcc: { id: "ipcc", label: "IPCC AR6 — impatti su rese agricole", url: "https://www.ipcc.ch/report/ar6/wg2/" },
};
