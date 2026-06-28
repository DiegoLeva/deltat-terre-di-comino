"use client";
import { ACTIONS } from "@/lib/paesc";

const STATUS = {
  DONE: { c: "#7CFF6B", t: "● DONE" },
  RUN: { c: "#00E5C7", t: "▸ RUN" },
  PLAN: { c: "#FFB020", t: "○ PLAN" },
} as const;

/** Action Tracker stile terminale scrollabile. */
export default function ActionTracker() {
  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="hatch">ACTION TRACKER // PAESC</span>
        <span className="hatch text-cyandim">{ACTIONS.length} azioni</span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto pr-1 font-mono text-[11px]">
        {ACTIONS.map((a) => {
          const s = STATUS[a.status];
          return (
            <div key={a.code} className="border-b border-line/60 pb-1">
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  <span className="text-cyandim">{a.code}</span> {a.title}
                </span>
                <span style={{ color: s.c }} className="ml-2 shrink-0 text-[10px]">
                  {s.t}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 bg-grid">
                  <div className="h-full" style={{ width: `${a.progress}%`, background: s.c }} />
                </div>
                <span className="w-9 text-right text-[10px] text-muted">{a.progress}%</span>
                <span className="w-20 text-right text-[10px] text-cyandim">
                  −{a.tco2.toLocaleString("it")}t
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
