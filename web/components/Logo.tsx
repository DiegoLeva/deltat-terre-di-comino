/* eslint-disable @next/next/no-img-element */

/** Logo ufficiale GAL Versante Laziale del PNA (web/public/brand/logo.png). */
export default function Logo({ height = 44 }: { height?: number }) {
  return (
    <a href="#top" className="flex items-center gap-3">
      <img
        src="/brand/logo.png"
        alt="GAL Versante Laziale del Parco Nazionale d'Abruzzo"
        style={{ height }}
        className="w-auto"
      />
      <span className="hidden leading-tight sm:block">
        <span className="block font-display text-[15px] font-semibold text-ink">Clima Terre di Comino</span>
        <span className="block text-[11px] font-medium text-slate">Osservatorio temperature · 32 comuni</span>
      </span>
    </a>
  );
}
