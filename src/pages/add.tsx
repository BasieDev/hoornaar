'use client';

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";
import { useRouter } from "next/navigation";

export default function Add() {
  const [selectedOption, setSelectedOption] = useState("Bij");
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (typeof img !== "string") {
          URL.revokeObjectURL(URL.createObjectURL(img));
        }
      });
    };
  }, [images]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const invalidFiles = files.filter(
      (file) => !["image/jpeg", "image/jpg"].includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setImageError("Alleen JPG/JPEG bestanden zijn toegestaan.");
      return;
    }
    if (images.length + files.length > 4) {
      setImageError("Je mag maximaal 4 foto's toevoegen.");
      return;
    }
    setImages([...images, ...files]);
    setCurrentImage(images.length);
    setImageError("");
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX = e.changedTouches[0].screenX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50 && currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
    if (touchEndX > touchStartX + 50 && currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  }
  let touchStartX = 0;
  let touchEndX = 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (images.length === 0) {
      setImageError("Je moet minimaal 1 JPG/JPEG foto toevoegen.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const typeMap: Record<string, number> = {
      "Bij": 0,
      "Hoornaar": 1,
      "Bijenkorf": 2,
      "Wespennest": 3,
    };

    if (!navigator.geolocation) {
      alert("Geolocatie wordt niet ondersteund door deze browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude.toString();
        const longitude = position.coords.longitude.toString();
        const payload = {
          description: formData.get("beschrijving") as string,
          type: typeMap[selectedOption] || 0,
          flower: formData.get("plant") as string,
          latitude,
          longitude,
          place: formData.get("locatie") as string,
          date: formData.get("datum") as string,
        };

        try {
          const token = localStorage.getItem("token");
          const response = await fetch("https://localhost:7235/api/sighting/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            let errorMsg = "Fout bij opslaan";
            try {
              const errorData = await response.json();
              if (errorData && errorData.errors) {
                errorMsg = Object.values(errorData.errors)
                  .flat()
                  .join(" ");
              } else if (errorData && errorData.detail) {
                errorMsg = errorData.detail;
              }
            } catch {}
            throw new Error(errorMsg);
          }

          let responseJson = null;
          try {
            responseJson = await response.clone().json();
          } catch {
            const text = await response.clone().text();
            console.log("API response (raw text):", text);
          }

          let locationUrl = null;
          if (responseJson?.uploadUrlImage) {
            locationUrl = responseJson.uploadUrlImage.startsWith('http')
              ? responseJson.uploadUrlImage
              : `https://localhost:7235${responseJson.uploadUrlImage}`;
          }
          if (locationUrl && images.length > 0) {
            const imageFormData = new FormData();
            images.forEach((img) => {
              imageFormData.append("images", img);
            });
            const imageUploadHeaders: Record<string, string> = {};
            if (token) {
              imageUploadHeaders["Authorization"] = `Bearer ${token}`;
            }
            try {
              const imageUploadResponse = await fetch(locationUrl, {
                method: "POST",
                headers: imageUploadHeaders,
                body: imageFormData,
              });
            } catch (err) {
              console.error("Image upload threw an error:", err);
            }
          }

          if (e.currentTarget) e.currentTarget.reset();
          setSelectedOption("");
          setImages([]);
          setCurrentImage(0);

          if (responseJson && responseJson.id) {
            window.location.href = `/add-conclusion/${responseJson.id}`;
          } else {
            window.location.href = "/map";
          }

        } catch (err: any) {
          setError(err?.message || "Er ging iets mis bij het versturen.");
          console.error(err);
        }
      },
      (error) => {
        alert("Kon locatie niet ophalen: " + error.message);
      }
    );
  }

  const title = "Nieuwe signalering";
  const options = ["Bij", "Hoornaar", "Bijenkorf", "Wespennest"];

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
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Datum:</p>
            <input
              type="date"
              name="datum"
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex items-center">
            <p className="text-[21px] text-[#BE895B] w-[100px]">Plant:</p>
            <input
              type="text"
              name="plant"
              className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-[21px] text-[#BE895B]">Beschrijving:</p>
            <textarea
              name="beschrijving"
              className="bg-[#EFEEEC] text-[#BE895B] rounded-2xl px-2 py-1 w-full"
              rows={4}
            />
          </div>

          {error && <div className="text-red-600 mt-4">{error}</div>}

          <div className="flex flex-col space-y-2 mt-6 w-full relative">
            <img
              src="/icons/bee.svg"
              alt="Bij icoon"
              className="w-6 h-5 absolute left-[-16px] top-[-12px]"
            />
            <p className="text-[21px] text-[#BE895B]">Voeg foto's toe:</p>

            <div
              className=" w-full h-[250px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center cursor-pointer  relative overflow-hidden"
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
            className="my-4 self-end bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
            
          >
            Versturen
          </button>
        </form>
      </Container>
    </div>
  );
}
