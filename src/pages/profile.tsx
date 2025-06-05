import { useState } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import SectionTitle from "@/components/sectiontitle";
import Container from "@/components/container";

export default function Profile() {
  const [active, setActive] = useState("profiel"); 

  const title =
    active === "profiel"
      ? "Mijn Profiel"
      : active === "signaleringen"
      ? "Mijn signaleringen"
      : "Mijn gegevens";

  return (
    <div className="home pb-[80px] min-h-screen flex flex-col">
      <Navbar />
      <header className="LogoSvg">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />

        <div className="flex space-x-4 my-6">
          <button
            onClick={() => setActive("signaleringen")}
            className={`px-6 py-1 rounded-4xl border transition-colors duration-300
              ${
                active === "signaleringen"
                  ? "bg-[#BE895B] text-white"
                  : "bg-[#FBD064] text-white hover:bg-[#A25714]"
              }`}
          >
            Mijn signaleringen
          </button>

          <button
            onClick={() => setActive("gegevens")}
            className={`px-6 py-1 rounded-4xl border transition-colors duration-300
              ${
                active === "gegevens"
                  ? "bg-[#BE895B] text-white"
                  : "bg-[#FBD064] text-white hover:bg-[#A25714]"
              }`}
          >
            Mijn gegevens
          </button>
        </div>

        <div>
          {active === "profiel" && (
            <p> miauw</p>
          )}

          {active === "signaleringen" && (
            <div>
              <p>jouw signaleringen.</p>
            </div>
          )}

          {active === "gegevens" && (
            <div>
              <p>persoonlijke gegevens.</p>
            </div>
          )}
        </div>

        {(active === "signaleringen" || active === "gegevens") && (
          <div className="mt-10 flex justify-start">
            <button
              onClick={() => setActive("profiel")}
              className="px-6 py-1 rounded-md border bg-[#FBD064] text-white hover:bg-[#A25714] transition"
            >
              Terug
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
