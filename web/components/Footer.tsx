/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="border-t border-[#e6e9df] bg-ink text-paper/90">
      <div className="container-x grid gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper">
              <img src="/brand/logo.png" alt="GAL Versante Laziale del PNA" className="h-9 w-auto" />
            </span>
            <span className="font-display font-semibold">Clima Terre di Comino</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-paper/70">
            Osservatorio climatico del distretto Terre di Comino — 32 comuni, GAL Versante Laziale
            del Parco Nazionale d'Abruzzo. Uno strumento per capire il riscaldamento locale e agire.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-accent">Dati & metodo</h4>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>Copernicus Climate Change Service (ERA5)</li>
            <li>Downscaling per quota −6,5 °C/km</li>
            <li>Media mobile 5 anni · baseline PAESC 2011</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-accent">Fonti impatti</h4>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>ISPRA · EIA · Climate Central</li>
            <li>Copernicus HESS · CMCC · IPCC AR6</li>
            <li>MedECC 2020</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
        Dati a fini divulgativi. ΔT da rianalisi ERA5; le stime d'impatto usano fattori medi da
        letteratura ufficiale. © {new Date().getFullYear()} Terre di Comino Smart Land.
      </div>
    </footer>
  );
}
