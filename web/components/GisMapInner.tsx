"use client";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import { CLIMATE } from "@/lib/data";

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], 11, { duration: 1.0 }); }, [lat, lon, map]);
  return null;
}

export default function GisMapInner({ selected }: { selected: string }) {
  const sel = CLIMATE.comuni.find((c) => c.nome === selected) ?? CLIMATE.comuni[0];
  return (
    <MapContainer center={[sel.lat, sel.lon]} zoom={11} scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }} attributionControl>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO' />
      <FlyTo lat={sel.lat} lon={sel.lon} />
      {CLIMATE.comuni.map((c) => {
        const active = c.nome === selected;
        return (
          <CircleMarker key={c.nome} center={[c.lat, c.lon]} radius={active ? 10 : 5}
            pathOptions={{
              color: active ? "#135B4C" : "#7fa39a",
              weight: active ? 3 : 1,
              fillColor: active ? "#00E66E" : "#bcd3c9",
              fillOpacity: active ? 0.85 : 0.5,
            }}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span style={{ fontSize: 12 }}>
                <b>{c.nome}</b> · {c.quota_m} m — ΔT {c.delta_t_1960_2025 >= 0 ? "+" : ""}{c.delta_t_1960_2025}°C
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
