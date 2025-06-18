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
  const [imageUrls, setImageUrls] = useState([

  ]);
  const [currentImage, setCurrentImage] = useState(0);

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

        <div className="mt-4 flex justify-between mb-10 ">
          <div className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col w-full bg-[#F0DFCD] rounded-2xl p-4 ">
              <div className="text-[#BE895B] text-[26px]">
                Signalering 1{" "}
                <span className="text-[21px] text-[#FAC131] ml-4">Bij</span>
              </div>

              <div className="mb-[6px] h-[2px] w-full bg-white rounded-sm" />

              <div className="text-[#BE895B] text-base space-y-2">
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Locatie:</span>
                  <span className="text-[#FAC131]">Via api</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Plant:</span>
                  <span className="text-[#FAC131]">Roos</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Datum:</span>
                  <span className="text-[#FAC131]">alleen huidige dag of verleden</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Weer:</span>
                  <span className="text-[#FAC131]">Via api</span>
                </div>
                <div>
                  <span>Beschrijving:</span> <br />
                  <span className="text-[#FAC131]">Hier komt de beschrijving.</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-10 w-full relative">
                <p className="text-[21px] text-[#BE895B]">Bekijk jouw foto's:</p>

                <div className="w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {imageUrls.length === 0 ? (
                    <span className="text-[#BE895B] text-center">
                      Geen foto's gevonden
                    </span>
                  ) : (
                    <>
                      <img
                        src={imageUrls[currentImage]}
                        alt={`Foto ${currentImage + 1}`}
                        className="object-cover w-full h-full"
                      />

                      {imageUrls.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                            onClick={() =>
                              currentImage > 0 && setCurrentImage(currentImage - 1)
                            }
                          >
                            <span className="text-[#A25714] text-3xl inline-block transform -scale-x-100">
                              &#10132;
                            </span>
                          </button>

                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                            onClick={() =>
                              currentImage < imageUrls.length - 1 &&
                              setCurrentImage(currentImage + 1)
                            }
                          >
                            <span className="text-[#A25714] text-3xl">&#10132;</span>
                          </button>
                        </>
                      )}

                    </>

                  )}
                  <div className="absolute bottom-2 right-3 bg-[#F0DFCD] bg-opacity-70  text-[#A25714] text-sm px-3 py-1 rounded-md ">
                        Gesignaleerd door: <span className="text-[#BE895B] ">user_id</span>
                      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
