"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import { CLIMATE } from "@/lib/data";

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 11, { duration: 1.1 });
  }, [lat, lon, map]);
  return null;
}

export default function GisMapInner({ selected }: { selected: string }) {
  const sel = CLIMATE.comuni.find((c) => c.nome === selected) ?? CLIMATE.comuni[0];

  return (
    <MapContainer
      center={[sel.lat, sel.lon]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#0B0F19" }}
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <FlyTo lat={sel.lat} lon={sel.lon} />

      {CLIMATE.comuni.map((c) => {
        const active = c.nome === selected;
        return (
          <CircleMarker
            key={c.nome}
            center={[c.lat, c.lon]}
            radius={active ? 9 : 4}
            pathOptions={{
              color: active ? "#00E5C7" : "#27324A",
              weight: active ? 2 : 1,
              fillColor: active ? "#00E5C7" : "#0A8A7A",
              fillOpacity: active ? 0.9 : 0.4,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <div style={{ fontFamily: "monospace", fontSize: 11 }}>
                <b>{c.nome}</b> · {c.quota_m} m<br />
                ΔT {c.delta_t_1960_2025 >= 0 ? "+" : ""}{c.delta_t_1960_2025}°C
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
