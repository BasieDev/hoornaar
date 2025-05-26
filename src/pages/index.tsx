import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (

    <div className="home pb-[80px]">
      <Navbar />
      <header className="relative w-full h-auto">
        <img src="/svg/bannermedium.svg" alt="Header Image" className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/svg/Middlelogo.png" alt="Centered Logo" className="h-22 w-auto" />
        </div>
      </header>
    </div>
  );
}
