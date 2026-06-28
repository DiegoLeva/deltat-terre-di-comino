"use client";
import { FACTS } from "@/lib/paesc";

/** Live Feed orizzontale con fatti ufficiali citati (loop infinito). */
export default function DataTicker() {
  const stream = [...FACTS, ...FACTS]; // duplicato per loop continuo
  return (
    <div className="panel relative flex items-center overflow-hidden">
      <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-line bg-bg px-3 py-2">
        <span className="h-2 w-2 animate-blink rounded-full bg-red" />
        <span className="text-[10px] font-bold tracking-widest text-red">LIVE&nbsp;FEED</span>
      </div>
      <div className="overflow-hidden">
        <div className="flex w-max animate-ticker gap-10 whitespace-nowrap py-2 pl-10">
          {stream.map((f, i) => (
            <span key={i} className="text-[11px] text-ink">
              <span className="mr-2 font-bold text-cyan">[{f.src}]</span>
              {f.text}
              <span className="ml-3 text-muted">◇</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
