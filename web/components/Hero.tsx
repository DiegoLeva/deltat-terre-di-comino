import { GoatMark } from "./Logo";
import { TODAY_YEAR } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-mint/60 to-paper">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <span className="eyebrow">Osservatorio climatico · Terre di Comino</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
            Di quanto è cresciuta la{" "}
            <span className="text-brand">temperatura</span> dove vivi?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Scegli uno dei <strong className="text-ink">32 comuni</strong> del distretto e un anno di
            riferimento. Ti diciamo quanto è aumentata la temperatura fino ad oggi —
            e cosa significa davvero nella vita di tutti i giorni: sonno, acqua, energia, cibo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#calcolatore" className="btn-primary px-6 py-3 text-base">Calcola il tuo ΔT</a>
            <a href="#nascita" className="rounded-full border border-[#cfdad3] px-6 py-3 text-base font-semibold text-brand hover:bg-mint/40">
              Com'era alla mia nascita →
            </a>
          </div>
          <p className="mt-5 text-xs text-slate">
            Dati: Copernicus Climate Change Service (ERA5) · ultimo anno osservato {TODAY_YEAR} ·
            baseline PAESC {2011}
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="card relative w-full max-w-sm p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-mint">
              <GoatMark className="h-10 w-10 text-brand" />
            </div>
            <p className="mt-5 font-display text-sm font-semibold uppercase tracking-wide text-slate">
              Riscaldamento del Mediterraneo
            </p>
            <p className="mt-2 font-display text-5xl font-extrabold text-warm3">+20%</p>
            <p className="mt-2 text-sm text-slate">
              più veloce della media globale. Qui il clima cambia più in fretta che altrove.
            </p>
            <p className="mt-4 text-[11px] text-slate/80">Fonte: MedECC 2020</p>
          </div>
        </div>
      </div>
    </section>
  );
}
