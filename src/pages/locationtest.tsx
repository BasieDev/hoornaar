import { useEffect, useState } from "react";

export default function LocationTest() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocatie wordt niet ondersteund door deze browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setError("Kon locatie niet ophalen: " + err.message);
      }
    );
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Huidige locatie</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {coords ? (
        <div>
          <p>Breedtegraad: {coords.lat}</p>
          <p>Lengtegraad: {coords.lng}</p>
        </div>
      ) : !error ? (
        <p>Locatie ophalen...</p>
      ) : null}
    </div>
  );
}
