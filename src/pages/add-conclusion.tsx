'use client';

import { useRef, useState } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";

export default function Add_Conclusion() {
  const title = "Jouw signalering";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files);

    if (replaceIndex !== null) {
      const updatedImages = [...images];
      updatedImages[replaceIndex] = newImages[0];
      setImages(updatedImages);
      setReplaceIndex(null);
    } else {
      setImages((prev) => [...prev, ...newImages]);
    }

    event.target.value = "";
    setImageError("");
  };

  const handleTouchStart = () => { };
  const handleTouchEnd = () => { };

  return (
    <div className="home pb-[80px]">
      <Navbar />
      <header className="logo-header">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />
        <div className="flex flex-col space-y-4 mt-6 w-full">
          {/* Ophalen van ingevulde images en data */}

          <div>
            <p className="text-[21px] text-[#BE895B] mb-2">Een:</p>
            <p className="text-[21px] text-[#BE895B] mb-2">Locatie:</p>
            <p className="text-[21px] text-[#BE895B] mb-2">Datum:</p>
            <p className="text-[21px] text-[#BE895B] mb-2">Plant:</p>
            <p className="text-[21px] text-[#BE895B] mb-2">Weer:</p>
            <p className="text-[21px] text-[#BE895B] mb-2">Beschrijving:</p>
          </div>
          {/* Ophalen van ingevulde images en data */}

          <div className="flex flex-col space-y-4 mt-6 w-full relative">
            <img
              src="/icons/bee.svg"
              alt="Bij icoon"
              className="w-6 h-5 absolute left-[-16px] top-[-12px]"
            />
            <p className="text-[21px] text-[#BE895B]">Jouw toegevoegde foto's:</p>

          </div>
        </div>
      </Container>
    </div>
  );
}
