'use client';

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";
import { useRouter } from "next/navigation";

export default function Add() {
  const title = "Nieuwe signalering";
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const options = ["Bij", "Hoornaar", "Bijenkorf", "Wespennest"];

  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = images.length + files.length;

    if (total > 4) {
      setImageError("Je mag maximaal 4 foto's toevoegen.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setCurrentImage(images.length);
    setImageError("");
  };

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50 && currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
    if (touchEndX > touchStartX + 50 && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedOption || !formData.get("locatie")) {
      alert("Vul minimaal het type en de locatie in.");
      return;
    }

    formData.append("wat", selectedOption);
    images.forEach((img, i) => formData.append(`image_${i}`, img));

    console.log("Formulierdata:", Object.fromEntries(formData));

    try {
      await fetch("/api/???", {
        method: "POST",
        body: formData,
      });

      router.push("/add-conclusion");
      e.currentTarget.reset();
      setSelectedOption("");
      setImages([]);
      setCurrentImage(0);
    } catch (err) {
      alert("Er ging iets mis bij het versturen.");
      console.error(err);
    }
  };

  return (
    <div className="home pb-[80px]">
      <Navbar />
      <header className="logo-header">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 w-full">
          <div>
            <p className="text-[21px] text-[#BE895B] mb-2">Wat:</p>
            <div className="flex gap-1 flex-wrap">
              {options.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`px-4 py-1 text-[14px] rounded-full border transition-colors duration-200 ${selectedOption === option
                    ? "bg-[#BE895B] text-white"
                    : "bg-[#FBD064] text-white"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* OPHALEN API? */}
          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Locatie:</p>
            <input
              type="text"
              name="locatie"
              required
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Datum:</p>
            <input
              type="date"
              name="datum"
              required
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Plant:</p>
            <input
              type="text"
              name="plant"
              required
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          {/* OPHALEN API? */}
          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Weer:</p>
            <input
              type="text"
              name="weer"
              required
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-[21px] text-[#BE895B]">Beschrijving:</p>
            <textarea
              name="beschrijving"
              required minLength={20}
              className="bg-[#EFEEEC] text-[#BE895B] rounded-2xl px-2 py-1 w-full"
              rows={4}
            />
          </div>

          <div className="flex flex-col space-y-4 mt-6 w-full relative">
            <img
              src="/icons/bee.svg"
              alt="Bij icoon"
              className="w-6 h-5 absolute left-[-16px] top-[-12px]"
            />
            <p className="text-[21px] text-[#BE895B]">Voeg foto's toe:</p>

            <div
              className="mt-2 w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center cursor-pointer  relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {images.length === 0 ? (
                <span className="text-[#BE895B] text-center">Klik hier om foto's toe te voegen</span>
              ) : (
                <>
                  <img
                    src={URL.createObjectURL(images[currentImage])}
                    alt={`Foto ${currentImage + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#BE895B] rounded-full px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentImage < images.length - 1) setCurrentImage(currentImage + 1);
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
                          if (currentImage > 0) setCurrentImage(currentImage - 1);
                        }}
                        tabIndex={-1}
                      >
                        <span className="text-[#A25714] text-3xl inline-block transform -scale-x-100">&#10132;</span>
                      </button>
                    </>
                  )}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {imageError && (
              <p className="text-[#FAC131] text-[14px] mt-1">{imageError}</p>
            )}

          </div>

          <button
            type="submit"
            className="my-4 self-start bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
            
          >
            Versturen
          </button>
        </form>
      </Container>
    </div>
  );
}
