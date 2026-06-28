"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Leaflet richiede window -> caricamento solo client-side
const Inner = dynamic(() => import("./GisMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-[11px] text-muted">
      ▱ INIZIALIZZAZIONE GIS…
    </div>
  ),
});

export default function GisMap({ selected }: { selected: string }) {
  return (
    <div className="panel corner overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="hatch">GIS // CARTODB DARK MATTER</span>
        <span className="hatch text-cyandim">◉ {selected}</span>
      </div>
      <div className="h-[300px] w-full">
        <Inner selected={selected} />
      </div>
    </div>
  );
}
