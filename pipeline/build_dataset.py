"""
build_dataset.py
----------------
Costruisce `../web/public/data/climate_data.json` per il frontend, a partire dalle
osservazioni reali Copernicus ERA5 (2011-2022) estratte da extract_grib.py.

Per ogni comune produce:
  - series  : serie annua 1950-2030 (osservata 2011-2022 + ricostruzione/proiezione
              modellata, con bias-correction sulle osservazioni) per le warming stripes.
  - monthly : confronto MENSILE stile "quanto fa più caldo": media mensile del
              periodo di riferimento (2011-2014) vs periodo recente (2019-2022),
              con lo scarto mese per mese, lo scarto medio e il mese di scarto massimo.
"""

from __future__ import annotations
import json, os, re, unicodedata
import numpy as np
import pandas as pd

from comuni import COMUNI, baseline_t

YEAR_START, YEAR_END = 1950, 2050
ANN_CSV = "osservazioni_era5.csv"
MON_CSV = "mensili_era5.csv"
DAY_CSV = "giornalieri_era5.csv"
OUT_JSON = os.path.join("..", "web", "public", "data", "climate_data.json")
DAILY_DIR = os.path.join("..", "web", "public", "data", "daily")


def slugify(nome: str) -> str:
    s = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s

BASE_PERIOD = (2011, 2014)   # periodo di riferimento ("il passato")
RECENT_PERIOD = (2022, 2025) # periodo recente ("oggi"), ultimi 4 anni pieni


def warming_anomaly(year: int) -> float:
    if year <= 1980:
        return 0.10 * (year - 1965) / 15.0
    t = year - 1980
    return 0.10 + 0.0285 * t + 0.00035 * t * t


def tropical_nights_model(t_mean: float, quota_m: float) -> int:
    return int(round(max(0.0, (t_mean - 12.0) * 4.2 - quota_m * 0.012)))


def heat_days_model(t_mean: float, quota_m: float) -> int:
    return int(round(max(0.0, (t_mean - 11.0) * 5.0 - quota_m * 0.012)))  # Tmax>30°C


def build_series(c, obs_c) -> list:
    b = baseline_t(c["quota_m"])
    obs_years = set(obs_c.index.tolist())
    model_raw = {y: b + warming_anomaly(y) for y in range(YEAR_START, YEAR_END + 1)}
    bias = (float(np.mean([float(obs_c.loc[y]["t_mean"]) - model_raw[y] for y in obs_years]))
            if obs_years else 0.0)

    recs = []
    for year in range(YEAR_START, YEAR_END + 1):
        if year in obs_years:
            r = obs_c.loc[year]
            recs.append({"year": year, "t_mean": round(float(r["t_mean"]), 2),
                         "tropical_nights": int(r["tropical_nights"]), "heat_days": int(r["heat_days"]),
                         "source": "era5", "projected": False})
        else:
            tm = round(model_raw[year] + bias, 2)
            recs.append({"year": year, "t_mean": tm,
                         "tropical_nights": tropical_nights_model(tm, c["quota_m"]),
                         "heat_days": heat_days_model(tm, c["quota_m"]),
                         "source": "model", "projected": year > 2025})
    df = pd.DataFrame(recs)
    df["t_mean_smooth"] = df["t_mean"].rolling(5, center=True, min_periods=1).mean().round(2)
    return df.to_dict(orient="records")


def build_monthly(mon_c: pd.DataFrame) -> dict:
    def period_mean(lo, hi):
        sub = mon_c[(mon_c["year"] >= lo) & (mon_c["year"] <= hi)]
        return sub.groupby("month")["t_mean"].mean()

    base = period_mean(*BASE_PERIOD)
    rec = period_mean(*RECENT_PERIOD)
    months = []
    for m in range(1, 13):
        bv = float(base.get(m, np.nan))
        rv = float(rec.get(m, np.nan))
        if np.isnan(bv) or np.isnan(rv):
            continue
        months.append({"m": m, "baseline": round(bv, 1), "recent": round(rv, 1),
                       "scarto": round(rv - bv, 1)})
    scarti = [x["scarto"] for x in months]
    avg = round(float(np.mean(scarti)), 1) if scarti else 0.0
    mx = max(months, key=lambda x: x["scarto"]) if months else {"m": 0, "scarto": 0}
    return {
        "base_period": f"{BASE_PERIOD[0]}-{BASE_PERIOD[1]}",
        "recent_period": f"{RECENT_PERIOD[0]}-{RECENT_PERIOD[1]}",
        "months": months,
        "scarto_medio": avg,
        "scarto_max": {"m": mx["m"], "value": mx["scarto"]},
    }


def build_comune(c, obs_ann, obs_mon) -> dict:
    obs_c = obs_ann[obs_ann["comune"] == c["nome"]].set_index("year")
    mon_c = obs_mon[obs_mon["comune"] == c["nome"]]
    series = build_series(c, obs_c)
    by_year = {s["year"]: s for s in series}
    today = max(y for y in by_year if by_year[y]["source"] == "era5")

    # Proiezione 2050: scenario "se il trend continua". L'incremento termico viene
    # dal modello (warming_anomaly), mentre le notti tropicali sono proiettate dalla
    # SENSIBILITÀ REALE del comune (quante notti in più per grado, osservate), ancorate
    # al dato reale di oggi: così non si scende mai sotto il valore odierno.
    d_today = round(warming_anomaly(2050) - warming_anomaly(today), 2)
    tn_today_v = by_year[today]["tropical_nights"]
    warm_obs = by_year[today]["t_mean_smooth"] - by_year[2011]["t_mean_smooth"]
    tn_rate = max(0.0, (tn_today_v - by_year[2011]["tropical_nights"]) / max(0.3, warm_obs))
    proj_2050 = {
        "t_mean": round(by_year[today]["t_mean"] + d_today, 1),
        "tropical_nights": min(180, int(round(tn_today_v + tn_rate * d_today))),
        "delta_today": d_today,
    }
    return {
        "nome": c["nome"], "slug": slugify(c["nome"]),
        "lat": c["lat"], "lon": c["lon"], "quota_m": c["quota_m"],
        "t_baseline_1961_1990": round(baseline_t(c["quota_m"]), 2),
        "today_year": today,
        "delta_2011_today": round(by_year[today]["t_mean_smooth"] - by_year[2011]["t_mean_smooth"], 2),
        "tn_2011": by_year[2011]["tropical_nights"],
        "tn_today": by_year[today]["tropical_nights"],
        "proj_2050": proj_2050,
        "monthly": build_monthly(mon_c),
        "series": series,
    }


def write_daily_files(obs_day: pd.DataFrame):
    """Un file JSON per comune: { "MM-DD": { "YYYY": [tmin, tmax] } } (per la funzione
    'giorno di nascita vs oggi'). Solo anni pieni con dato osservato."""
    os.makedirs(DAILY_DIR, exist_ok=True)
    obs_day = obs_day.copy()
    obs_day["year"] = obs_day["date"].str[:4]
    obs_day["mmdd"] = obs_day["date"].str[5:]
    n = 0
    for c in COMUNI:
        sub = obs_day[obs_day["comune"] == c["nome"]]
        days: dict = {}
        for _, r in sub.iterrows():
            days.setdefault(r["mmdd"], {})[r["year"]] = [r["tmin"], r["tmax"]]
        path = os.path.join(DAILY_DIR, f"{slugify(c['nome'])}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"nome": c["nome"], "days": days}, f, ensure_ascii=False, separators=(",", ":"))
        n += 1
    print(f"[ok] giornalieri: {n} file -> {DAILY_DIR}/")


ANN_STORICO = "annuale_storico.csv"
DAY_STORICO = "giornalieri_storico.csv"


def main():
    obs_ann = pd.read_csv(ANN_CSV)
    obs_mon = pd.read_csv(MON_CSV)
    obs_day = pd.read_csv(DAY_CSV)

    # --- fusione con i dati STORICI (1961-..) se presenti ---
    cols_ann = ["comune", "year", "t_mean", "tropical_nights", "heat_days"]
    if os.path.exists(ANN_STORICO):
        st_ann = pd.read_csv(ANN_STORICO)[cols_ann]
        obs_ann = pd.concat([obs_ann[cols_ann], st_ann], ignore_index=True)
        print(f"[storico] +{len(st_ann)} righe annuali storiche")
    if os.path.exists(DAY_STORICO):
        st_day = pd.read_csv(DAY_STORICO)[["comune", "date", "tmin", "tmax"]]
        obs_day = pd.concat([obs_day[["comune", "date", "tmin", "tmax"]], st_day], ignore_index=True)
        print(f"[storico] +{len(st_day)} righe giornaliere storiche")

    print(f"[era5] {len(obs_ann)} righe annuali, {len(obs_mon)} mensili, {len(obs_day)} giornaliere")

    out = {
        "meta": {
            "district": "GAL Versante Laziale del PNA — Terre di Comino",
            "province": "Frosinone",
            "n_comuni": len(COMUNI),
            "year_start": YEAR_START, "year_end": YEAR_END,
            "obs_start": 2011, "obs_end": 2025,
            "source_dataset": "Copernicus Climate Change Service — ERA5 (ECMWF)",
            "lapse_rate_c_per_km": 6.5,
            "base_period": f"{BASE_PERIOD[0]}-{BASE_PERIOD[1]}",
            "recent_period": f"{RECENT_PERIOD[0]}-{RECENT_PERIOD[1]}",
            "thresholds": {"tropical_night_min_c": 20, "hot_day_max_c": 30},
            "paesc": {"baseline_year": 2011, "baseline_tco2": 512395,
                      "target_year": 2030, "target_tco2": 295555, "target_reduction_pct": 42.32},
        },
        "comuni": [build_comune(c, obs_ann, obs_mon) for c in COMUNI],
    }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"[ok] {OUT_JSON} ({os.path.getsize(OUT_JSON)/1024:.1f} KB, {len(out['comuni'])} comuni)")

    write_daily_files(obs_day)


if __name__ == "__main__":
    main()
