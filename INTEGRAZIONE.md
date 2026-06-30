# Integrazione nel portale GAL — Guida tecnica

Questo pacchetto contiene il sito **"Clima Terre di Comino"** (osservatorio temperature dei 32 comuni
del distretto), pronto per essere integrato in un altro sito/portale.

Sono possibili **due strade**. La più semplice è la **A (iframe)**.

---

## A. Integrazione via `<iframe>` (consigliata, 5 minuti)

Il sito è già predisposto per essere incluso in un'altra pagina. È disponibile una **modalità embed**
che nasconde intestazione, footer e fascia introduttiva, lasciando solo i contenuti interattivi:
basta aggiungere `?embed=1` all'URL.

Incollare questo codice nella pagina del portale dove deve comparire la sezione clima:

```html
<iframe
  src="https://clima-galverla.vercel.app/?embed=1"
  title="Osservatorio clima — Terre di Comino"
  style="width:100%; min-height:1600px; border:0;"
  loading="lazy">
</iframe>
```

Note:
- La modalità embed è attivata da `?embed=1`. Senza, viene mostrato il sito completo.
- L'altezza (`min-height`) va regolata in base allo spazio: il contenuto è lungo. In alternativa si
  può usare lo script di auto-resize in `esempio-embed.html`.
- Il sito è già configurato per permettere l'inclusione in iframe da qualsiasi dominio
  (header `Content-Security-Policy: frame-ancestors *` in `web/next.config.mjs`). Per limitarlo al
  solo dominio del portale, modificare quel valore (istruzioni nel file).
- `esempio-embed.html` è una pagina di prova pronta all'uso: aprirla in un browser per vedere l'embed.

### Se si vuole ospitare l'iframe sul proprio dominio
Si può rideployare il progetto (vedi punto B) e puntare l'iframe al nuovo URL. Il funzionamento è identico.

---

## B. Ospitare il sito sul proprio server / sottocartella

Il sito è un'app **Next.js 14** (React). Si compila in pagine statiche + una piccola funzione API.

### Avvio in locale
```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

### Build di produzione
```bash
cd web
npm install
npm run build
npm run start      # serve la build su http://localhost:3000
```

### Deploy
- **Vercel** (più semplice): importare il repository, impostare **Root Directory = `web`**, deploy.
- **Altro hosting Node**: eseguire `npm run build` e `npm run start` dietro un reverse proxy.
- **Sottocartella** (es. `www.galverla.eu/clima`): impostare in `web/next.config.mjs`:
  ```js
  const nextConfig = { basePath: "/clima", reactStrictMode: true, /* ...headers... */ };
  ```
  e rifare la build.

---

## Struttura del pacchetto

```
web/                      # il sito (Next.js) — è questa la parte da integrare
  app/                    # pagine e route API (/api/delta)
  components/             # componenti React (grafici, mappa, calcolatori, card)
  lib/                    # logica e dati
  public/
    brand/logo.png        # logo GAL
    data/climate_data.json    # dataset principale (32 comuni)
    data/daily/*.json         # serie giornaliere per comune (funzione "giorno di nascita")
  package.json, next.config.mjs, tailwind.config.ts, tsconfig.json
pipeline/                 # script Python che genera i dati dai file GRIB (NON serve per il sito)
relazione/                # relazione divulgativa (LaTeX)
esempio-embed.html        # esempio pronto di integrazione via iframe
INTEGRAZIONE.md           # questo file
```

## Aggiornare i dati (facoltativo)
I dati climatici sono nel file statico `web/public/data/climate_data.json` (più i giornalieri in
`web/public/data/daily/`). Per rigenerarli da nuovi file GRIB ERA5 servono gli script in `pipeline/`
(Python). Per la sola integrazione del sito **non è necessario**: i dati sono già inclusi.

## Note
- Nessuna chiave API, nessun database: il sito è statico + una funzione che legge i dati inclusi.
- Tutto il calcolo (aumento temperatura, impatti, proiezione) avviene lato client o da file JSON locali.
- Personalizzazioni grafiche: i colori sono in `web/tailwind.config.ts`, i testi nei componenti in
  `web/components/`. Modificabili liberamente.
```
