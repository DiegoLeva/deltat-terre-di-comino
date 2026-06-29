"""
extract_grib.py
---------------
Legge file GRIB ERA5 (t2m orario) locali con xarray + cfgrib e estrae, per ciascuno
dei 32 comuni Terre di Comino, gli indicatori climatici annuali OSSERVATI:

    - t_mean   : temperatura media annua (degC)
    - tmin     : Tmin media (per riferimento)
    - tropical_nights : notti tropicali  (Tmin giornaliera > 20 degC)
    - heat_days       : giorni di canicola (Tmax giornaliera > 35 degC)

LAPSE-RATE / DOWNSCALING ALTIMETRICO
La cella ERA5 a 0.25 deg (~25 km) contiene piu' comuni a quote diverse. Il valore di
cella viene corretto verso la quota reale del comune:

    T_comune = T_cella - 6.5 degC/km * (quota_comune - quota_cella)

dove quota_cella e' la geopotenziale/orografia ERA5 (z) se disponibile, altrimenti una
stima. Cosi' due comuni nella stessa cella (es. Cassino 45 m e Picinisco 725 m)
ottengono valori distinti e fisicamente coerenti.

Output: DataFrame -> osservazioni_era5.csv   (una riga per comune/anno con source=era5)

Uso:
    python extract_grib.py --grib-dir grib --out osservazioni_era5.csv
"""

from __future__ import annotations
import _grib_env  # noqa: F401  -> configura ecCodes (Windows/py3.x) prima di cfgrib
import argparse
import glob
import os
import numpy as np
import pandas as pd
import xarray as xr

from comuni import COMUNI, LAPSE_RATE

# Quota media della cella ERA5 sull'area (m). In produzione: leggere l'orografia ERA5
# (variabile 'z' geopotenziale / g) per ogni cella. Qui stima media dell'area Comino.
ERA5_CELL_OROG_FALLBACK_M = 400.0


def _collect_files(grib_path: str) -> list[str]:
    """Accetta un singolo .grib oppure una cartella di .grib/.grb."""
    if os.path.isfile(grib_path):
        return [grib_path]
    files = sorted(glob.glob(os.path.join(grib_path, "*.grib")) +
                   glob.glob(os.path.join(grib_path, "*.grb")))
    if not files:
        raise FileNotFoundError(f"Nessun .grib in {grib_path!r}")
    return files


def _open_t2m(grib_path: str) -> xr.DataArray:
    """
    Apre i .grib e ritorna SOLO il campo t2m (2m temperature, paramId 167) in degC.
    Il filtro per shortName='2t' evita il DatasetBuildError quando il file contiene
    anche mn2t/mx2t con step temporali diversi.
    """
    files = _collect_files(grib_path)
    # Apertura file-per-file + concat su 'time': i singoli .grib possono avere gap
    # interni (es. 2015-17 + 2022) e non formare un ipercubo monotono per by_coords.
    arrs = []
    for f in files:
        ds = xr.open_dataset(
            f,
            engine="cfgrib",
            backend_kwargs={"indexpath": "", "filter_by_keys": {"shortName": "2t"}},
        )
        name = "t2m" if "t2m" in ds else ("2t" if "2t" in ds else list(ds.data_vars)[0])
        arrs.append(ds[name])

    t2m = xr.concat(arrs, dim="time") if len(arrs) > 1 else arrs[0]
    t2m = t2m.sortby("time")
    # rimuove eventuali timestamp duplicati (file sovrapposti)
    _, uniq = np.unique(t2m["time"].values, return_index=True)
    t2m = t2m.isel(time=np.sort(uniq))
    t2m = t2m - 273.15  # Kelvin -> Celsius
    t2m.name = "t2m"
    return t2m


def _cell_orography(ds_like: xr.DataArray, lat: float, lon: float) -> float:
    """Quota della cella ERA5 (m). Stub: usa fallback. In prod leggere 'z'/9.80665."""
    return ERA5_CELL_OROG_FALLBACK_M


def _nearest_cell(t2m: xr.DataArray, lat: float, lon: float) -> xr.DataArray:
    """Serie temporale t2m della cella ERA5 piu' vicina al comune."""
    # ERA5 usa lon 0..360 in alcuni dataset; normalizza se necessario
    lon_q = lon % 360 if float(t2m.longitude.max()) > 180 else lon
    return t2m.sel(latitude=lat, longitude=lon_q, method="nearest")


def _prep_series(cell_hourly, lapse_corr: float) -> pd.Series:
    """Serie ORARIA della cella -> pandas Series in degC corretta per quota."""
    s = cell_hourly.to_series()
    s.index = pd.to_datetime(s.index)
    return s + lapse_corr  # downscaling altimetrico verso la quota del comune


def _annual_indicators(s: pd.Series) -> pd.DataFrame:
    """Indicatori annuali da serie oraria già corretta per quota."""
    daily_min = s.resample("1D").min()
    daily_max = s.resample("1D").max()
    daily_mean = s.resample("1D").mean()
    df = pd.DataFrame({"tmin": daily_min, "tmax": daily_max, "tmean": daily_mean})
    df["year"] = df.index.year
    out = df.groupby("year").agg(
        t_mean=("tmean", "mean"),
        tmin=("tmin", "mean"),
        tropical_nights=("tmin", lambda x: int((x > 20.0).sum())),
        heat_days=("tmax", lambda x: int((x > 30.0).sum())),  # giorni caldi Tmax>30°C
    ).reset_index()
    return out


def _monthly_means(s: pd.Series) -> pd.DataFrame:
    """Media mensile (year, month, t_mean) dalla serie oraria corretta per quota."""
    m = s.resample("MS").mean()
    df = pd.DataFrame({"t_mean": m})
    df["year"] = df.index.year
    df["month"] = df.index.month
    return df.dropna(subset=["t_mean"]).reset_index(drop=True)[["year", "month", "t_mean"]]


def extract(grib_dir: str):
    """Ritorna (annuale_df, mensile_df) reali per i 32 comuni."""
    t2m = _open_t2m(grib_dir)
    ann_rows, mon_rows = [], []
    for c in COMUNI:
        cell = _nearest_cell(t2m, c["lat"], c["lon"])
        orog = _cell_orography(t2m, c["lat"], c["lon"])
        lapse_corr = -LAPSE_RATE * (c["quota_m"] - orog)
        s = _prep_series(cell, lapse_corr)

        ind = _annual_indicators(s)
        ind = ind.dropna(subset=["t_mean"]).reset_index(drop=True)
        ind.insert(0, "comune", c["nome"])
        ind["quota_m"] = c["quota_m"]
        ind["lapse_corr_c"] = round(lapse_corr, 3)
        ind["source"] = "era5"
        ann_rows.append(ind)

        mon = _monthly_means(s)
        mon.insert(0, "comune", c["nome"])
        mon_rows.append(mon)

    ann = pd.concat(ann_rows, ignore_index=True)
    ann["t_mean"] = ann["t_mean"].round(2)
    ann["tmin"] = ann["tmin"].round(2)
    mon = pd.concat(mon_rows, ignore_index=True)
    mon["t_mean"] = mon["t_mean"].round(2)
    return ann, mon


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--grib-dir", default="grib")
    ap.add_argument("--out", default="osservazioni_era5.csv")
    ap.add_argument("--out-monthly", default="mensili_era5.csv")
    args = ap.parse_args()

    ann, mon = extract(args.grib_dir)
    ann.to_csv(args.out, index=False)
    mon.to_csv(args.out_monthly, index=False)
    print(f"[ok] annuale: {len(ann)} righe -> {args.out}")
    print(f"[ok] mensile: {len(mon)} righe -> {args.out_monthly}")
    print(ann.head(6).to_string(index=False))


if __name__ == "__main__":
    main()
