'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";

export default function Add_Conclusion() {
  const router = useRouter();
  const title = "Jouw signalering";

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch("/api/get-uploaded-images");
        if (!response.ok) throw new Error("Fout bij ophalen foto's");
        const data = await response.json();

        setImageUrls(data.images);
      } catch (error) {
        console.error(error);
        setImageUrls([]);
      }
    }

    fetchImages();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Versturen formulier...");
  };

  return (
    <div className="home pb-[80px]">
      <Navbar />
      <header className="logo-header">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />

        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 max-w-full ">
            <p className="text-[21px] text-[#BE895B] ">Een:</p>
            <p className="text-[16px] text-[#BE895B] ">INPUT WAT</p>

            <p className="text-[21px] text-[#BE895B] ">Locatie:</p>
            <p className="text-[16px] text-[#BE895B] ">INPUT LOCATIE</p>

            <p className="text-[21px] text-[#BE895B] ">Datum:</p>
            <p className="text-[16px] text-[#BE895B] ">INPUT DATUM</p>

            <p className="text-[21px] text-[#BE895B] ">Plant:</p>
            <p className="text-[16px] text-[#BE895B] ">INPUT PLANT</p>

            <p className="text-[21px] text-[#BE895B] ">Weer:</p>
            <p className="text-[16px] text-[#BE895B] ">INPUT WEER</p>

            <p className="text-[21px] text-[#BE895B] ">Beschrijving:</p>
            <p className="text-[16px] text-[#BE895B] ">Geeeeeeeeeeeeeeeeeeee beschrijvingmiauw</p>
          </div>

          <div className="flex flex-col space-y-2 mt-10 w-full relative">
            <img
              src="/icons/bee.svg"
              alt="Bij icoon"
              className="w-6 h-5 absolute left-[-16px] top-[-12px]"
            />
            <p className="text-[21px] text-[#BE895B]">Bekijk jouw foto's:</p>

            <div className="w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center relative overflow-hidden">
              {imageUrls.length === 0 ? (
                <span className="text-[#BE895B] text-center">Geen foto's gevonden</span>
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
                        onClick={() => currentImage > 0 && setCurrentImage(currentImage - 1)}
                      >
                        <span className="text-[#A25714] text-3xl inline-block transform -scale-x-100">&#10132;</span>
                      </button>

                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                        onClick={() => currentImage < imageUrls.length - 1 && setCurrentImage(currentImage + 1)}
                      >
                        <span className="text-[#A25714] text-3xl">&#10132;</span>
                      </button>
                    </>
                  )}
                </>
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

            <button
              type="submit"
              className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
            >
              Versturen
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
