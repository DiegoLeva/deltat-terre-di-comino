# ΔT — Terre di Comino Smart Land · Climate Telemetry

Telemetria climatica per il distretto **Terre di Comino Smart Land** (32 comuni, prov. Frosinone).
Calcola il riscaldamento (ΔT) vissuto da un utente dalla nascita a oggi e lo traduce in impatti quotidiani,
ancorato agli obiettivi del PAESC locale.

## Struttura

```
PAESC-CLIMA/
├── pipeline/                  # PARTE 1 — Data Pipeline (Python)
│   ├── comuni.py              # 32 comuni: lat/lon + quota (m s.l.m.)
│   ├── extract_grib.py        # ERA5 .grib -> osservazioni per comune (xarray+cfgrib)
│   ├── build_dataset.py       # backcast 1950->2030, lapse-rate, media mobile 5y, export JSON
│   ├── requirements.txt
│   └── grib/                  # <-- metti qui i .grib ERA5 (t2m orario)
│
└── web/                       # PARTE 2 — Frontend (Next.js App Router + Tailwind)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── TimeMachine.tsx
    │   ├── HUD.tsx
    │   ├── ImpactCard.tsx
    │   ├── WarmingStripes.tsx
    │   ├── SeriesPanel.tsx
    │   ├── PaescTelemetry.tsx
    │   ├── ActionTracker.tsx
    │   ├── DataTicker.tsx
    │   ├── ClimateBriefing.tsx
    │   └── GisMap.tsx
    ├── lib/
    │   ├── impacts.ts          # logiche calcolo ΔT + impatti (osservato vs stima)
    │   ├── comuni.ts
    │   └── paesc.ts            # baseline/target emissioni, azioni, fatti ufficiali
    ├── public/data/climate_data.json
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    └── tsconfig.json
```

## Run

```bash
# Pipeline
cd pipeline
pip install -r requirements.txt
python build_dataset.py            # genera ../web/public/data/climate_data.json

# Frontend
cd ../web
npm install
npm run dev
```
