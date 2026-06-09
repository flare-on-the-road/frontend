'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CCTVItem } from '@/constants/cctvData';

interface MapProps {
  cctvs: CCTVItem[];
  selectedCctv: CCTVItem | null;
  onSelectCctv: (cctv: CCTVItem) => void;
}

export default function Map({ cctvs, selectedCctv, onSelectCctv }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([37.5665, 126.9780], 11); // Center of Seoul

      // Use a clean voyager tile style matching the screenshot aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add custom zoom control in top-right corner
      L.control.zoom({
        position: 'topright',
      }).addTo(map);

      // Add scale control at bottom left
      L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false,
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers to prevent duplicates
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Create a camera SVG icon matching the golden source design system
    const cameraIconHtml = `
      <div class="w-full h-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-white">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </div>
    `;

    // Add markers for CCTVs
    cctvs.forEach((cctv) => {
      const cctvIcon = L.divIcon({
        className: 'cctv-marker',
        html: cameraIconHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const popupContent = `
        <div class="p-1 font-sans text-xs min-w-[120px]">
          <h4 class="font-bold text-slate-800 mb-0.5">${cctv.title}</h4>
          <p class="text-slate-500 mb-1">${cctv.location}</p>
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full ${
              cctv.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
            }"></span>
            <span class="${
              cctv.status === 'connected' ? 'text-emerald-600' : 'text-amber-600'
            } font-medium">
              ${cctv.status === 'connected' ? '실시간 연결중' : '점검중'}
            </span>
          </div>
        </div>
      `;

      const marker = L.marker([cctv.lat, cctv.lng], { icon: cctvIcon })
        .addTo(map)
        .bindPopup(popupContent, { closeButton: false, offset: [0, -10] });

      marker.on('click', () => {
        onSelectCctv(cctv);
      });

      markersRef.current[cctv.id] = marker;
    });

    // Add some realistic decorative marker clusters to match the screenshot design
    // Seongnam (Cluster of 8)
    const cluster8Html = `<div class="w-[30px] h-[30px] leading-[30px] rounded-full text-center font-bold text-xs text-white">8</div>`;
    const cluster8Icon = L.divIcon({
      className: 'marker-cluster marker-cluster-medium',
      html: cluster8Html,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    L.marker([37.4200, 127.1200], { icon: cluster8Icon }).addTo(map);

    // Mapo/Yongsan (Cluster of 11)
    const cluster11Html = `<div class="w-[30px] h-[30px] leading-[30px] rounded-full text-center font-bold text-xs text-white">11</div>`;
    const cluster11Icon = L.divIcon({
      className: 'marker-cluster marker-cluster-large',
      html: cluster11Html,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    L.marker([37.5400, 126.9500], { icon: cluster11Icon }).addTo(map);

    // Incheon/Bucheon (Cluster of 5)
    const cluster5Html = `<div class="w-[30px] h-[30px] leading-[30px] rounded-full text-center font-bold text-xs text-white">5</div>`;
    const cluster5Icon = L.divIcon({
      className: 'marker-cluster marker-cluster-small',
      html: cluster5Html,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    L.marker([37.4800, 126.6800], { icon: cluster5Icon }).addTo(map);

    return () => {
      // Clean up clusters too if we rebuilt, but since it's simplified we let the map handle standard mount lifecycle.
    };
  }, [cctvs, onSelectCctv]);

  // Effect to handle selected CCTV panning and popup display
  useEffect(() => {
    if (!mapRef.current || !selectedCctv) return;

    mapRef.current.setView([selectedCctv.lat, selectedCctv.lng], 13, {
      animate: true,
      duration: 1.2,
    });

    const marker = markersRef.current[selectedCctv.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  }, [selectedCctv]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner border border-warm-200/50">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] md:min-h-[480px]" />
      
      {/* Small floating copyright to replicate screenshot */}
      <div className="absolute bottom-2 right-2 bg-cream-50/80 px-2 py-0.5 rounded text-[10px] text-slate-500 font-sans pointer-events-none z-[1000] border border-warm-200/30">
        문제점 보고 | <span className="font-semibold text-slate-600">OpenStreetMap 기여자</span> | 기부하기 | 홈페이지 및 API 약관
      </div>
    </div>
  );
}
