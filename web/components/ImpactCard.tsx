import type { ImpactValue } from "@/lib/impacts";

const ICON: Record<string, string> = {
  sonno: "🌙",
  energia: "⚡",
  acqua: "💧",
  cibo: "🌾",
};

export default function ImpactCard({ impact }: { impact: ImpactValue }) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl" aria-hidden>{ICON[impact.key] ?? "•"}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            impact.measured ? "bg-brand/10 text-brand" : "bg-cloud text-slate"
          }`}
        >
          {impact.measured ? "DATO OSSERVATO" : "STIMA"}
        </span>
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-slate">{impact.label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold text-warm3">{impact.value}</p>
      <p className="mt-2 flex-1 text-sm leading-snug text-ink/80">{impact.caption}</p>
      <a
        href={impact.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-[11px] text-slate underline-offset-2 hover:text-brand hover:underline"
      >
        Fonte: {impact.source.label}
      </a>
    </div>
  );
}
