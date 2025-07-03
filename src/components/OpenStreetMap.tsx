'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function OpenStreetMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        mapInstanceRef.current = L.map(mapRef.current).setView([52.2, 5.3], 7);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        fetch('https://localhost:7235/api/sighting/all?page=1&pageSize=100')
          .then(async (res) => {
            // Defensive: check for non-OK and empty responses
            if (!res.ok) throw new Error('Network response was not ok');
            const text = await res.text();
            if (!text) throw new Error('Empty response');
            try {
              return JSON.parse(text);
            } catch (e) {
              throw new Error('Invalid JSON');
            }
          })
          .then((data) => {
            const sightings = Array.isArray(data?.sighting) ? data.sighting : [];
            sightings.forEach((sighting: any) => {
              const lat = typeof sighting.latitude === 'number' ? sighting.latitude : null;
              const lng = typeof sighting.longitude === 'number' ? sighting.longitude : null;
              if (lat !== null && lng !== null) {
                L.circleMarker([lat, lng], {
                  color: 'orange',
                  fillColor: 'orange',
                  fillOpacity: 0.75,
                  radius: 8,
                })
                  .addTo(mapInstanceRef.current)
                  .bindPopup(`
                    <div style="min-width:120px;text-align:center;">
                      <strong>${
                        sighting.type === 0 ? 'Bij' :
                        sighting.type === 1 ? 'Hoornaar' :
                        sighting.type === 2 ? 'bijenkorf' :
                        sighting.type === 3 ? 'Wespennest' :
                        'Onbekend'
                      }</strong><br/>
                      <span>${sighting.place || 'Unknown location'}</span><br/>
                      <a href="/login">Detail</a><br/>
                      <small>Spotted on: ${sighting.date ? sighting.date.split('T')[0] : 'Unknown date'}</small>
                    </div>
                  `);
              }
            });
          })
          .catch((err) => {
            console.error('Failed to load sightings', err);
          });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full rounded-md shadow-md min-h-[350px]"></div>;
}
