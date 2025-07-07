import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const title = "Welkom op de Bijenspotter!";

  const [showModal, setShowModal] = useState(false);
  const [signaleringen, setSignaleringen] = useState<any[]>([]);
  const typeMap: Record<number, string> = {
    0: "Onbekend",
    1: "Bij",
    2: "Hoornaar",
    3: "Bijenkorf",
    4: "Wespennest"
  };

  const weatherCodes: Record<number, string> = {
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

  useEffect(() => {
    fetch("https://localhost:7235/api/sighting/all?page=1&pageSize=100")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.sighting) {
          setSignaleringen(data.sighting);
        }
      })
      .catch((err) => {
        console.error("Fout bij ophalen van signaleringen:", err);
      });
  }, []);
  // Track the current image index for each signalering
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [id: number]: number }>({});

  // Helper to get current image index for a signalering
  const getCurrentImageIndex = (sigId: number) => currentImageIndexes[sigId] || 0;
  const setCurrentImageIndex = (sigId: number, idx: number) => {
    setCurrentImageIndexes((prev) => ({ ...prev, [sigId]: idx }));
  };

  // Touch handling for mobile swipe
  const touchStartXRef = useRef<{ [id: number]: number }>({});
  const handleTouchStart = (sigId: number, e: React.TouchEvent) => {
    touchStartXRef.current[sigId] = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (sigId: number, imagesLength: number, e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchStartX = touchStartXRef.current[sigId] || 0;
    const currentIdx = getCurrentImageIndex(sigId);
    if (touchEndX < touchStartX - 50 && currentIdx < imagesLength - 1) {
      setCurrentImageIndex(sigId, currentIdx + 1);
    }
    if (touchEndX > touchStartX + 50 && currentIdx > 0) {
      setCurrentImageIndex(sigId, currentIdx - 1);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="home pb-[80px] mb-10">
      <Navbar />
      <header className="LogoSvg">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />
        <p className="text-[#BE895B] text-xl">De bijen worden in Nederland bedreigd door verschillende factoren. Toch zijn ze enorm belangrijk voor ons ecosysteem. De Bijenspotter is de plek om jouw steentje bij te dragen.  </p>
        <p className="text-[#F5B800] my-2 text-3xl">Nieuwste signaleringen  </p>

        <div className="mt-4 flex flex-col space-y-6 w-full mb-10">
          {signaleringen.map((sig, idx) => (
            <div key={sig.id} className="flex flex-col w-full bg-[#F0DFCD] rounded-2xl p-4 ">
              <div
                className="text-[#BE895B] text-[26px] cursor-pointer hover:underline"
                onClick={() => window.location.href = `/add-conclusion/${sig.id}`}
                title={`Bekijk signalering #${sig.id}`}
              >
                Signalering #{sig.id}{" "}
                <span className="text-[21px] text-[#FAC131] ml-4">{typeMap[sig.type] || 'Onbekend'}</span>
              </div>
              <div className="mb-[6px] h-[2px] w-full bg-white rounded-sm" />
              <div className="text-[#BE895B] text-base space-y-2">
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Locatie:</span>
                  <span className="text-[#FAC131]">{sig.place}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Plant:</span>
                  <span className="text-[#FAC131]">{sig.flower}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Datum:</span>
                  <span className="text-[#FAC131]">{sig.date ? sig.date.split('T')[0] : ''}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Weer:</span>
                  <span className="text-[#FAC131]">
                    {sig.weather && typeof sig.weather === 'object'
                      ? `${sig.weather.temperature !== undefined ? `${sig.weather.temperature}°C - ` : ''}${weatherCodes[sig.weather.code] || sig.weather.code || 'Onbekend'}`
                      : sig.weather || ''}
                  </span>
                </div>
                <div>
                  <span>Beschrijving:</span> <br />
                  <span className="text-[#FAC131]">{sig.description}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-10 w-full relative">
                <p className="text-[21px] text-[#BE895B]">Foto's:</p>
                <div
                  className="w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center relative overflow-hidden"
                  onTouchStart={sig.images && sig.images.length > 0 ? (e) => handleTouchStart(sig.id, e) : undefined}
                  onTouchEnd={sig.images && sig.images.length > 0 ? (e) => handleTouchEnd(sig.id, sig.images.length, e) : undefined}
                >
                  {sig.images && sig.images.length > 0 ? (
                    <>
                      <img
                        src={sig.images[getCurrentImageIndex(sig.id)]?.url}
                        alt={`Foto ${getCurrentImageIndex(sig.id) + 1}`}
                        className="object-cover w-full h-full"
                      />
                      {sig.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = getCurrentImageIndex(sig.id);
                              if (idx < sig.images.length - 1) setCurrentImageIndex(sig.id, idx + 1);
                            }}
                            tabIndex={-1}
                          >
                            <span className="text-[#A25714] text-3xl">&#10132;</span>
                          </button>
                          <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = getCurrentImageIndex(sig.id);
                              if (idx > 0) setCurrentImageIndex(sig.id, idx - 1);
                            }}
                            tabIndex={-1}
                          >
                            <span className="text-[#A25714] text-3xl inline-block transform -scale-x-100">&#10132;</span>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-[#BE895B] text-center">Geen foto's gevonden</span>
                  )}
                  <div className="absolute bottom-2 right-3 bg-[#F0DFCD] bg-opacity-70  text-[#A25714] text-sm px-3 py-1 rounded-md ">
                    Gesignaleerd door: <span className="text-[#BE895B] ">{sig.userName || sig.userId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
