export type Source = "era5" | "model";

export interface YearPoint {
  year: number;
  t_mean: number;
  t_mean_smooth: number;
  tropical_nights: number;
  heat_days: number;
  source: Source;
  projected: boolean;
}

export interface MonthPoint {
  m: number;        // 1..12
  baseline: number; // media periodo di riferimento
  recent: number;   // media periodo recente
  scarto: number;   // recent - baseline
}

export interface Monthly {
  base_period: string;    // "2011-2014"
  recent_period: string;  // "2019-2022"
  months: MonthPoint[];
  scarto_medio: number;
  scarto_max: { m: number; value: number };
}

export interface Comune {
  nome: string;
  lat: number;
  lon: number;
  quota_m: number;
  t_baseline_1961_1990: number;
  today_year: number;
  delta_2011_today: number;
  tn_2011: number;
  tn_today: number;
  monthly: Monthly;
  series: YearPoint[];
}

export interface ClimateData {
  meta: {
    district: string;
    province: string;
    n_comuni: number;
    year_start: number;
    year_end: number;
    obs_start: number;
    obs_end: number;
    source_dataset: string;
    lapse_rate_c_per_km: number;
    base_period: string;
    recent_period: string;
    thresholds: { tropical_night_min_c: number; hot_day_max_c: number };
    paesc: {
      baseline_year: number;
      baseline_tco2: number;
      target_year: number;
      target_tco2: number;
      target_reduction_pct: number;
    };
  };
  comuni: Comune[];
}

export const MESI = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
export const MESI_LONG = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
