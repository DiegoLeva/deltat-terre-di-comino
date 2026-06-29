"""
extract_storico.py
------------------
Estrazione dei dati STORICI (anni '60-'80) per costruire la baseline climatica
ufficiale 1961-1990 (standard WMO). I file storici ERA5 contengono i campi di
minima e massima giornaliera (mn2t / mx2t), NON la media oraria (t2m): la media
giornaliera viene quindi approssimata come (tmin + tmax) / 2, prassi consolidata
per le normali climatiche quando si dispone solo di min/max.

Input : tutti i .grib in grib_storico/ (mn2t, mx2t)
Output: giornalieri_storico.csv (comune, date, tmin, tmax)
        annuale_storico.csv      (comune, year, t_mean, tropical_nights, heat_days)
        mensile_storico.csv      (comune, year, month, t_mean)

Stessa correzione altimetrica (lapse-rate) del flusso recente, così i valori
storici sono confrontabili con quelli odierni.
"""
from __future__ import annotations
import _grib_env  # noqa: F401
import argparse, glob, os
import numpy as np
import pandas as pd
import xarray as xr

from comuni import COMUNI, LAPSE_RATE
from extract_grib import _nearest_cell, _cell_orography, ERA5_CELL_OROG_FALLBACK_M  # noqa: F401


def _open_var(files: list[str], shortname: str) -> xr.DataArray:
    """Apre un campo (mn2t o mx2t) da più file storici, collassando su valid_time."""
    arrs = []
    for f in files:
        ds = xr.open_dataset(
            f, engine="cfgrib",
            backend_kwargs={"indexpath": "", "filter_by_keys": {"shortName": shortname},
                            "time_dims": ["valid_time"]},
        )
        arrs.append(ds[list(ds.data_vars)[0]])
    da = xr.concat(arrs, dim="valid_time") if len(arrs) > 1 else arrs[0]
    da = da.sortby("valid_time")
    _, uniq = np.unique(da["valid_time"].values, return_index=True)
    da = da.isel(valid_time=np.sort(uniq)) - 273.15
    return da


def extract(grib_dir: str):
    files = sorted(glob.glob(os.path.join(grib_dir, "*.grib")) + glob.glob(os.path.join(grib_dir, "*.grb")))
    if not files:
        raise FileNotFoundError(f"Nessun .grib storico in {grib_dir!r}")
    mn = _open_var(files, "mn2t")
    mx = _open_var(files, "mx2t")

    day_rows, ann_rows, mon_rows = [], [], []
    for c in COMUNI:
        orog = ERA5_CELL_OROG_FALLBACK_M
        lapse = -LAPSE_RATE * (c["quota_m"] - orog)

        smn = _nearest_cell(mn, c["lat"], c["lon"]).to_series(); smn.index = pd.to_datetime(smn.index); smn += lapse
        smx = _nearest_cell(mx, c["lat"], c["lon"]).to_series(); smx.index = pd.to_datetime(smx.index); smx += lapse

        tmin = smn.resample("1D").min()
        tmax = smx.resample("1D").max()
        d = pd.DataFrame({"tmin": tmin.round(1), "tmax": tmax.round(1)}).dropna()
        d["tmean"] = ((d["tmin"] + d["tmax"]) / 2)
        d.index.name = "date"
        d = d.reset_index()
        d["date"] = pd.to_datetime(d["date"]).dt.strftime("%Y-%m-%d")
        d["comune"] = c["nome"]
        day_rows.append(d[["comune", "date", "tmin", "tmax"]])

        dd = d.copy()
        dd["year"] = dd["date"].str[:4].astype(int)
        dd["month"] = dd["date"].str[5:7].astype(int)
        ann = dd.groupby("year").agg(
            t_mean=("tmean", "mean"),
            tropical_nights=("tmin", lambda x: int((x > 20).sum())),
            heat_days=("tmax", lambda x: int((x > 30).sum())),
            n=("tmean", "count"),
        ).reset_index()
        ann = ann[ann["n"] >= 350].drop(columns="n")
        ann.insert(0, "comune", c["nome"]); ann["t_mean"] = ann["t_mean"].round(2)
        ann_rows.append(ann)

        mon = dd.groupby(["year", "month"])["tmean"].mean().round(2).reset_index().rename(columns={"tmean": "t_mean"})
        mon.insert(0, "comune", c["nome"])
        mon_rows.append(mon)

    return (pd.concat(ann_rows, ignore_index=True),
            pd.concat(mon_rows, ignore_index=True),
            pd.concat(day_rows, ignore_index=True))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--grib-dir", default="grib_storico")
    args = ap.parse_args()
    ann, mon, day = extract(args.grib_dir)
    ann.to_csv("annuale_storico.csv", index=False)
    mon.to_csv("mensile_storico.csv", index=False)
    day.to_csv("giornalieri_storico.csv", index=False)
    print(f"[ok] storico annuale {len(ann)} | mensile {len(mon)} | giornaliero {len(day)}")
    print("anni coperti:", sorted(ann['year'].unique()))
    print(ann.head(6).to_string(index=False))


if __name__ == "__main__":
    main()
