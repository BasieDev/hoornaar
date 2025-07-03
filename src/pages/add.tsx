'use client';

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import Container from "@/components/container";
import SectionTitle from "@/components/sectiontitle";
import { useRouter } from "next/navigation";

export default function Add() {
  const [selectedOption, setSelectedOption] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
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
      images.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [images]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
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
    const formData = new FormData(e.currentTarget);
    const typeMap: Record<string, number> = {
      "Bij": 1,
      "Hoornaar": 2,
      "Bijenkorf": 3,
      "Wespennest": 4,
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
          console.log("Payload:", payload);
          console.log(token)
          const response = await fetch("https://localhost:7234/api/sighting/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
          });

          let responseText = await response.clone().text();
          let responseJson = null;
          try { 
            responseJson = JSON.parse(responseText);
          } catch {}
          if (responseJson) {
            console.log("API response (parsed JSON):", responseJson);
          } else {
            console.log("API response (raw text):", responseText);
          }

          let locationUrl = null;
          if (responseJson?.uploadUrlImage) {
            locationUrl = responseJson.uploadUrlImage.startsWith('http')
              ? responseJson.uploadUrlImage
              : `https://localhost:7235${responseJson.uploadUrlImage}`;
          }
          console.log("Image upload URL from JSON:", locationUrl);
          if (locationUrl && images.length > 0) {
            // Log the exact URL and image names that will be posted
            console.log("Uploading images to:", locationUrl);
            console.log("Image file names:", images.map(img => img.name));
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
              let imageUploadText = await imageUploadResponse.clone().text();
              let imageUploadJson = null;
              try {
                imageUploadJson = JSON.parse(imageUploadText);
              } catch {}
              if (!imageUploadResponse.ok) {
                console.error("Image upload failed:", {
                  status: imageUploadResponse.status,
                  statusText: imageUploadResponse.statusText,
                  body: imageUploadText,
                  url: locationUrl
                });
              }
              if (imageUploadJson) {
                console.log("Image upload response (parsed JSON):", imageUploadJson);
              } else {
                console.log("Image upload response (raw text):", imageUploadText);
              }
            } catch (err) {
              console.error("Image upload threw an error:", err);
            }
          } else {
            console.log("No images to upload or image upload URL not found in JSON.");
          }

          if (e.currentTarget) e.currentTarget.reset();
          setSelectedOption("");
          setImages([]);
          setCurrentImage(0);

          // Redirect to add-conclusion/{id} if id is present in responseJson
          if (responseJson && responseJson.id) {
            router.push(`/add-conclusion/${responseJson.id}`);
          }

        } catch (err: any) {
          alert(`Er ging iets mis bij het versturen.\n${err?.message || err}`);
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

          <div className="flex flex-col items-start gap-2">
            <p className="text-[21px] text-[#BE895B]">Beschrijving:</p>
            <textarea
              name="beschrijving"
              required minLength={20} maxLength={200}
              className="bg-[#EFEEEC] text-[#BE895B] rounded-2xl px-2 py-1 w-full"
              rows={4}
            />
          </div>

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
