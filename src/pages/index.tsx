import { useState, useEffect } from "react";
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
  const [currentImage, setCurrentImage] = useState(0);
  const [activeSignalering, setActiveSignalering] = useState(0);

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
                  <span className="text-[#FAC131]">{sig.weather ? `${sig.weather.temperature}°C (code ${sig.weather.code})` : ''}</span>
                </div>
                <div>
                  <span>Beschrijving:</span> <br />
                  <span className="text-[#FAC131]">{sig.description}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-10 w-full relative">
                <p className="text-[21px] text-[#BE895B]">Bekijk jouw foto's:</p>
                <div className="w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {sig.images && sig.images.length > 0 ? (
                    <div className="flex w-full h-full overflow-x-auto gap-2">
                      {[
                        ...sig.images.filter((img: { thumbnail?: boolean }) => img.thumbnail),
                        ...sig.images.filter((img: { thumbnail?: boolean }) => !img.thumbnail)
                      ].map((img: { url: string; thumbnail?: boolean }, imgIdx: number) => (
                        <img
                          key={img.url + imgIdx}
                          src={img.url}
                          alt={`Foto ${imgIdx + 1}`}
                          className="object-cover h-full max-w-[250px] rounded-lg"
                        />
                      ))}
                    </div>
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
