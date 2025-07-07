'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function OpenStreetMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: false,
        }).setView([52.2, 5.3], 7);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Lazy load all sightings, page by page
        let cancelled = false;
        const pageSize = 1;
        let page = 1;
        let totalCount = 0;
        let loadedCount = 0;

        const loadPage = async () => {
          try {
            const res = await fetch(`https://localhost:7235/api/sighting/all?page=${page}&pageSize=${pageSize}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const text = await res.text();
            if (!text) throw new Error('Empty response');
            const data = JSON.parse(text);
            if (cancelled) return;
            totalCount = data.totalCount || 0;
            const sightings = Array.isArray(data?.sighting) ? data.sighting : [];
            loadedCount += sightings.length;
            sightings.forEach((sighting) => {
              const lat = typeof sighting.latitude === 'number' ? sighting.latitude : null;
              const lng = typeof sighting.longitude === 'number' ? sighting.longitude : null;
              if (lat !== null && lng !== null) {
                let color = '#FF8585';
                switch (sighting.type) {
                  case 1:
                    color = '#9288FF';
                    break;
                  case 2:
                    color = '#FF0000';
                    break;
                  case 3:
                    color = '#1904FF';
                    break;
                  case 0:
                  default:
                    color = '#FFA500';
                }
                L.circleMarker([lat, lng], {
                  color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  radius: 8,
                })
                  .addTo(mapInstanceRef.current)
                  .bindPopup(`
                    <div style="min-width:120px;text-align:center;">
                      <strong>${
                        sighting.type === 0 ? 'Bij' :
                        sighting.type === 1 ? 'Hoornaar' :
                        sighting.type === 2 ? 'Bijenkorf' :
                        sighting.type === 3 ? 'Wespennest' :
                        'Onbekend'
                      }</strong><br/>
                      <span>${sighting.place || 'Unknown location'}</span><br/>
                      <a href="/add-conclusion/${sighting.id}">Detail</a><br/>
                      <small>Spotted on: ${sighting.date ? sighting.date.split('T')[0] : 'Unknown date'}</small>
                    </div>
                  `);
              }
            });
            if (loadedCount < totalCount && sightings.length > 0) {
              page++;
              setTimeout(loadPage, 0); // schedule next page
            } else {
              setLoading(false);
            }
          } catch (err) {
            if (!cancelled) {
              setLoading(false);
              console.error('Failed to load sightings', err);
            }
          }
        };
        loadPage();
        // Cleanup
        return () => { cancelled = true; };
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full rounded-md shadow-md" style={{ minHeight: 0, margin: 0, padding: 0 }}></div>
  );
}
