'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function OpenStreetMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any = null;
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current) return;
        // Remove any existing map instance from the div
        if (mapRef.current && mapRef.current.innerHTML !== '') {
          mapRef.current.innerHTML = '';
        }
        map = L.map(mapRef.current).setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);
      });
    }
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full rounded-md shadow-md min-h-[350px]"></div>;
}
