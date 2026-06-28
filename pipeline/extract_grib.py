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


def _annual_indicators(cell_hourly: xr.Series, lapse_corr: float) -> pd.DataFrame:
    """
    Da serie ORARIA di una cella -> indicatori annuali, applicando la correzione
    di lapse-rate (offset costante in degC) prima di contare le soglie.
    """
    s = cell_hourly.to_series()
    s.index = pd.to_datetime(s.index)
    s = s + lapse_corr  # downscaling altimetrico: shift verso la quota del comune

    # aggregazioni giornaliere
    daily_min = s.resample("1D").min()
    daily_max = s.resample("1D").max()
    daily_mean = s.resample("1D").mean()

    df = pd.DataFrame({
        "tmin": daily_min,
        "tmax": daily_max,
        "tmean": daily_mean,
    })
    df["year"] = df.index.year

    out = df.groupby("year").agg(
        t_mean=("tmean", "mean"),
        tmin=("tmin", "mean"),
        tropical_nights=("tmin", lambda x: int((x > 20.0).sum())),
        heat_days=("tmax", lambda x: int((x > 35.0).sum())),
    ).reset_index()
    return out


def extract(grib_dir: str) -> pd.DataFrame:
    t2m = _open_t2m(grib_dir)
    rows = []
    for c in COMUNI:
        cell = _nearest_cell(t2m, c["lat"], c["lon"])
        orog = _cell_orography(t2m, c["lat"], c["lon"])
        lapse_corr = -LAPSE_RATE * (c["quota_m"] - orog)  # degC

        ind = _annual_indicators(cell, lapse_corr)
        # il resample giornaliero crea righe per gli anni SENZA dati nel GRIB
        # (gap temporali): scartale, restano solo gli anni realmente osservati.
        ind = ind.dropna(subset=["t_mean"]).reset_index(drop=True)
        ind = ind[ind["t_mean"].notna()]
        ind.insert(0, "comune", c["nome"])
        ind["quota_m"] = c["quota_m"]
        ind["cell_orog_m"] = orog
        ind["lapse_corr_c"] = round(lapse_corr, 3)
        ind["source"] = "era5"
        ind["projected"] = False
        rows.append(ind)

    df = pd.concat(rows, ignore_index=True)
    # arrotondamenti
    df["t_mean"] = df["t_mean"].round(2)
    df["tmin"] = df["tmin"].round(2)
    return df


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--grib-dir", default="grib")
    ap.add_argument("--out", default="osservazioni_era5.csv")
    args = ap.parse_args()

    df = extract(args.grib_dir)
    df.to_csv(args.out, index=False)
    print(f"[ok] {len(df)} righe -> {args.out}")
    print(df.head(12).to_string(index=False))


if __name__ == "__main__":
    main()
