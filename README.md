# Clima Terre di Comino — Osservatorio temperature

Sito web divulgativo sul riscaldamento climatico nei **32 comuni** del distretto
**GAL Versante Laziale del PNALM** (provincia di Frosinone). Mostra, comune per comune, quanto è
aumentata la temperatura rispetto alla normale climatica 1961–1990 e ne traduce gli effetti nella vita
quotidiana (sonno, energia, acqua, agricoltura), con grafici, mappa, classifica, scenario 2050 e una
card condivisibile.

Sito online: **https://clima-galverla.vercel.app**

## 👉 Integrazione in un altro portale

Vedi **[INTEGRAZIONE.md](INTEGRAZIONE.md)** — guida passo-passo (iframe pronto + auto-resize, oppure
hosting su proprio server). Per una prova immediata aprire **[esempio-embed.html](esempio-embed.html)**.

## Struttura

```
web/            Il sito (Next.js 14 + Tailwind) — è la parte da integrare
  app/          pagine e route API (/api/delta); ?embed=1 = modalità senza intestazione/footer
  components/   componenti React (grafici, mappa Leaflet, calcolatori, card social)
  lib/          logica e accesso ai dati
  public/
    brand/logo.png
    data/climate_data.json     dataset principale (32 comuni)
    data/daily/*.json          serie giornaliere per comune
pipeline/       script Python che generano i dati dai file GRIB ERA5 (non serve per il sito)
relazione/      relazione divulgativa (LaTeX)
esempio-embed.html, INTEGRAZIONE.md
```

## Avvio rapido (sviluppo)

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

## Build di produzione

```bash
cd web
npm install
npm run build
npm run start
```

## Dati

I dati climatici sono inclusi come file statici in `web/public/data/`. Non servono database né chiavi
API. Per rigenerarli da nuovi file GRIB ERA5 (Copernicus) si usano gli script in `pipeline/`
(Python: `extract_grib.py`, `extract_storico.py`, `build_dataset.py`); per la sola integrazione del
sito non è necessario.

Fonte dati: Copernicus Climate Change Service — ERA5 / ERA5-Land (ECMWF). Serie osservata 1961–2025,
confronto rispetto alla normale climatica WMO 1961–1990.
```
