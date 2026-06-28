"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const Inner = dynamic(() => import("./GisMapInner"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-slate">Caricamento mappa…</div>,
});

export default function GisMap({ selected }: { selected: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#eef3f0] px-5 py-3">
        <h3 className="font-display text-sm font-bold text-ink">Mappa del distretto · 32 comuni</h3>
        <span className="text-xs text-slate">selezionato: <b className="text-brand">{selected}</b></span>
      </div>
      <div className="h-[340px] w-full">
        <Inner selected={selected} />
      </div>
    </div>
  );
}
