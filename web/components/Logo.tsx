/**
 * Marchio: testa di stambecco/capra (simbolo del Parco Nazionale d'Abruzzo,
 * territorio del GAL Versante Laziale del PNA). Line-art, usa `currentColor`.
 *
 * Per usare il LOGO UFFICIALE: metti il file in `web/public/brand/logo.png`
 * (o .svg) e imposta la prop `src` -> verrà mostrata l'immagine al posto del mark.
 */
export function GoatMark({ className = "h-9 w-9 text-brand" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {/* corno sinistro */}
        <path d="M27 25 C 22 17 19 12 13 7" />
        <path d="M24 18 L21 15" />
        <path d="M21 14 L18 11" />
        {/* corno destro */}
        <path d="M37 25 C 42 17 45 12 51 7" />
        <path d="M40 18 L43 15" />
        <path d="M43 14 L46 11" />
        {/* testa / muso */}
        <path d="M27 25 C 25 35 27 43 32 47 C 37 43 39 35 37 25" />
        {/* orecchie */}
        <path d="M27 27 C 22 28 19 26 17 23" />
        <path d="M37 27 C 42 28 45 26 47 23" />
      </g>
      {/* occhi */}
      <circle cx="29" cy="31" r="1.5" fill="currentColor" />
      <circle cx="35" cy="31" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint">
        <GoatMark className="h-7 w-7 text-brand" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-700 font-semibold text-ink">
            Clima Terre di Comino
          </span>
          <span className="block text-[11px] font-medium tracking-wide text-slate">
            GAL Versante Laziale del PNA · Osservatorio ΔT
          </span>
        </span>
      )}
    </a>
  );
}
