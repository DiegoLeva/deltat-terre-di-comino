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

export interface Comune {
  nome: string;
  lat: number;
  lon: number;
  quota_m: number;
  t_baseline_1961_1990: number;
  delta_t_1960_2025: number;
  series: YearPoint[];
}

export interface ClimateData {
  meta: {
    district: string;
    province: string;
    n_comuni: number;
    year_start: number;
    year_end: number;
    source_dataset: string;
    lapse_rate_c_per_km: number;
    smoothing: string;
    thresholds: { tropical_night_min_c: number; heat_day_max_c: number };
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
