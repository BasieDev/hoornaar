'use client';

import { useEffect, useState } from "react";

const weatherCodeDescriptions: Record<number, string> = {
  0: "Zonnig",
  1: "Voornamelijk zonnig",
  2: "Gedeeltelijk bewolkt",
  3: "Bewolkt",
  45: "Mistig",
  48: "Aanhoudende rijp-mist",
  51: "Lichte motregen",
  53: "Motregen",
  55: "Zware motregen",
  56: "Lichte onderkoelde motregen",
  57: "Onderkoelde motregen",
  61: "Lichte regen",
  63: "Regen",
  65: "Zware regen",
  66: "Lichte onderkoelde regen",
  67: "Onderkoelde regen",
  71: "Lichte sneeuw",
  73: "Sneeuw",
  75: "Zware sneeuw",
  77: "Sneeuwkorrels",
  80: "Lichte buien",
  81: "Buien",
  82: "Zware buien",
  85: "Lichte sneeuwbuien",
  86: "Sneeuwbuien",
  95: "Onweer",
  96: "Licht onweer met hagel",
  99: "Onweer met hagel"
};

function getWeatherDescription(code: number | undefined): string | undefined {
  if (typeof code !== 'number') return undefined;
  return weatherCodeDescriptions[code];
}
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";


interface SightingImage {
  thumbnail: boolean;
  url: string;
}

interface SightingWeather {
  temperature: number;
  code: number;
}

interface Sighting {
  id: number;
  userId: string;
  userName: string;
  date: string;
  description: string;
  flower: string;
  type: number;
  place: string;
  latitude: number;
  longitude: number;
  images: SightingImage[];
  weather: SightingWeather;
  createdAt: string;
}



export default function AddConclusionPage() {
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(undefined);
  const [sighting, setSighting] = useState<Sighting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  let title = sighting ? `Signalering #${sighting.id}` : '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/');
      setId(parts[parts.length - 1] || undefined);
    }
  }, []);


  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`https://localhost:7235/api/sighting/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Fout bij ophalen van de signalering");
        const data = await response.json();
        setSighting(data);
        if (Array.isArray(data.images)) {
          setImageUrls(data.images.map((img: SightingImage) => img.url));
        } else {
          setImageUrls([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Onbekende fout");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="home pb-[80px]">
      <Navbar />
      <header className="logo-header">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : sighting ? (
          <div className="space-y-6">
            <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 max-w-full ">
              <p className="text-[18px] text-[#BE895B] ">Een:</p>
              <p className="text-[18px] text-[#BE895B] ">{
                sighting.type === 1 ? 'Bij' :
                sighting.type === 2 ? 'Hoornaar' :
                sighting.type === 3 ? 'Bijenkorf' :
                sighting.type === 4 ? 'Wespennest' :
                'Onbekend'
              }</p>
              <p className="text-[18px] text-[#BE895B] ">Locatie:</p>
              <p className="text-[18px] text-[#BE895B] ">{sighting.place} ({sighting.latitude}, {sighting.longitude})</p>
              <p className="text-[18px] text-[#BE895B] ">Datum:</p>
                <p className="text-[18px] text-[#BE895B] ">{new Date(sighting.date).toLocaleDateString()}</p>
              <p className="text-[18px] text-[#BE895B] ">Plant:</p>
              <p className="text-[18px] text-[#BE895B] ">{sighting.flower}</p>
              <p className="text-[18px] text-[#BE895B] ">Weer:</p>
              <p className="text-[18px] text-[#BE895B] ">
                {sighting.weather
                  ? `${sighting.weather.temperature}°C${
                      getWeatherDescription(sighting.weather.code)
                        ? ' – ' + getWeatherDescription(sighting.weather.code)
                        : sighting.weather.code !== undefined
                          ? ` (code: ${sighting.weather.code})`
                          : ''
                    }`
                  : '-'}
              </p>
              <p className="text-[18px] text-[#BE895B] ">Beschrijving:</p>
              <p className="text-[18px] text-[#BE895B] ">{sighting.description}</p>
            </div>

            <div className="flex flex-col space-y-2 mt-10 w-full relative">
              <img
                src="/icons/bee.svg"
                alt="Bij icoon"
                className="w-6 h-5 absolute left-[-16px] top-[-12px]"
              />
              <p className="text-[21px] text-[#BE895B]">Bekijk jouw foto's:</p>
              <div className="w-full min-h-[120px] bg-[#E3D8D8] rounded-2xl flex flex-wrap items-center justify-center gap-2 p-2 relative overflow-x-auto">
                {imageUrls.length === 0 ? (
                  <span className="text-[#BE895B] text-center">Geen foto's gevonden</span>
                ) : (
                  imageUrls.map((url, i) => (
                    <div key={url} className="w-[120px] h-[120px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center overflow-hidden">
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-between my-6 ">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
              >
                Terug
              </button>
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
