import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";


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
      <header className="LogoSvg">
                  <LogoSvg />
              </header>
    </div>
  );
}
