import { META, TODAY_YEAR } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-[#e6e9df] bg-gradient-to-b from-cream to-paper">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <span className="eyebrow">Osservatorio climatico · GAL Versante Laziale del PNA</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.04] text-ink md:text-6xl">
            Quanto fa <span className="text-brand">più caldo</span> nel tuo comune?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Non sono solo le ondate di calore: è la <strong className="text-ink">media</strong> a dirci
            che fa molto più caldo rispetto al passato. In Europa, dagli anni Ottanta, la temperatura
            media cresce di circa <strong className="text-ink">0,5&nbsp;°C ogni dieci anni</strong> — il
            doppio della media mondiale. Cerca uno dei <strong className="text-ink">32 comuni</strong> del
            distretto e guarda quanto è cambiato il clima, mese per mese.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#esplora" className="btn-primary px-6 py-3 text-base">Cerca il tuo comune →</a>
            <a href="#cosa-comporta" className="rounded-full border border-[#cdd6c8] px-6 py-3 text-base font-semibold text-brand hover:bg-mint/50">
              Cosa comporta tutto questo
            </a>
          </div>
          <p className="mt-5 text-xs text-slate">
            Elaborazione su dati ERA5 — {META.source_dataset}. Osservazioni {META.obs_start}–{META.obs_end}.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="card relative w-full max-w-sm p-7">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-slate">
              Il dato che conta
            </p>
            <p className="mt-2 font-display text-5xl font-extrabold text-warm3">+0,5°C</p>
            <p className="mt-1 text-sm text-slate">ogni 10 anni in Europa dagli anni '80 (WMO, Copernicus C3S).</p>
            <hr className="my-5 border-[#eceee7]" />
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-slate">
              Qui, sull'Appennino
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Le aree interne e più fredde si scaldano <strong>più in fretta</strong>: i comuni montani
              del distretto sono tra i più esposti al cambiamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
