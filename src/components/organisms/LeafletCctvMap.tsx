"use client";

import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap, ZoomControl } from "react-leaflet";

import type { Cctv } from "@/types/cctv";

const KOREA_CENTER: [number, number] = [36.45, 127.85];

type LeafletCctvMapProps = {
  cctvs: Cctv[];
  selectedCctv: Cctv | null;
  onSelect: (cctv: Cctv) => void;
};

export default function LeafletCctvMap({
  cctvs,
  selectedCctv,
  onSelect,
}: LeafletCctvMapProps) {
  return (
    <div className="relative h-full">
      <MapContainer
        center={KOREA_CENTER}
        className="h-full w-full"
        maxZoom={13}
        minZoom={6}
        preferCanvas
        scrollWheelZoom
        zoom={7}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <FlyToSelected cctv={selectedCctv} />
        {cctvs.map((cctv) => {
          const isSelected = selectedCctv?.id === cctv.id;

          return (
            <CircleMarker
              key={cctv.id}
              center={[cctv.lat, cctv.lng]}
              eventHandlers={{
                click: () => onSelect(cctv),
              }}
              fillColor={isSelected ? "#ff8c21" : "#0f172a"}
              fillOpacity={isSelected ? 1 : 0.86}
              pathOptions={{
                color: "#fffdf7",
                weight: isSelected ? 3 : 2,
              }}
              radius={isSelected ? 12 : 8}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <strong>{cctv.name}</strong>
                <br />
                {cctv.roadName || "도로 정보 없음"}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-5 top-5 z-[500] rounded-full bg-warm-50/95 px-4 py-2 text-sm font-black text-slate-900 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-cream-50">
        고속도로 CCTV 지도
      </div>

      {selectedCctv ? (
        <div className="pointer-events-none absolute inset-x-5 bottom-5 z-[500] rounded-lg bg-slate-950/78 p-4 text-cream-50 shadow-sm backdrop-blur">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-flare-500">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-black">{selectedCctv.name}</p>
              <p className="mt-1 truncate text-sm font-semibold text-warm-300">
                {selectedCctv.roadName || "도로 정보 없음"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FlyToSelected({ cctv }: { cctv: Cctv | null }) {
  const map = useMap();

  useEffect(() => {
    if (!cctv) {
      return;
    }

    map.flyTo([cctv.lat, cctv.lng], Math.max(map.getZoom(), 10), {
      animate: true,
      duration: 0.6,
    });
  }, [cctv, map]);

  return null;
}
