import { useState } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import SectionTitle from "@/components/sectiontitle";
import Container from "@/components/container";

export default function Profile() {
  const [active, setActive] = useState("profiel");
  const [showModal, setShowModal] = useState(false);

  const title =
    active === "profiel"
      ? "Mijn Profiel"
      : active === "signaleringen"
        ? "Mijn signaleringen"
        : "Mijn gegevens";

  return (
    <div className="home pb-[80px] min-h-screen flex flex-col relative">
      <Navbar />
      <header className="LogoSvg">
        <LogoSvg />
      </header>
      <Container>
        <SectionTitle title={title} />

        <div className="flex space-x-4 mt-5 mb-4">
          <button
            onClick={() => setActive("signaleringen")}
            className={`px-6 py-1 rounded-4xl border transition-colors duration-300
              ${active === "signaleringen"
                ? "bg-[#BE895B] text-white"
                : "bg-[#FBD064] text-white hover:bg-[#A25714]"
              }`}
          >
            Mijn signaleringen
          </button>

          <button
            onClick={() => setActive("gegevens")}
            className={`px-6 py-1 rounded-4xl border transition-colors duration-300
              ${active === "gegevens"
                ? "bg-[#BE895B] text-white"
                : "bg-[#FBD064] text-white hover:bg-[#A25714]"
              }`}
          >
            Mijn gegevens
          </button>
        </div>

        <div>
          {active === "profiel" && (
            <p className="text-[#BE895B]">
              Welkom op jouw profielpagina. <br />
              Hier kan je je gegevens inzien en wijzigen, maar ook je gemaakte signaleringen bekijken en wijzigen.
            </p>
          )}

          {active === "gegevens" && (
            <div className="flex flex-col space-y-1 w-full">
              <div>
                <p className="text-[21px] text-[#BE895B] mb-2">Bijnaam:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">E-mail:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">Voornaam:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">Achternaam:</p>
              </div>
            </div>
          )}



        </div>

        <div className="mt-10 flex justify-between">
          {(active === "signaleringen" || active === "gegevens") && (
            <div className="flex space-x-4 w-full justify-center">
              <button
                onClick={() => setActive("profiel")}
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
              >
                Terug
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
              >
                Wijzig
              </button>
            </div>
          )}
        </div>
      </Container>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-[#BE895B]">
              {active === "gegevens" ? "Gegevens wijzigen" : "Signaleringen wijzigen"}
            </h2>
            <p className="text-sm text-gray-600 mb-4">Hier komt een formulier voor wijzigen...</p>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <input
              type="text"
              placeholder={active === "gegevens" ? "Nieuwe voornaam" : "Nieuwe signalering"}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <button className="bg-[#BE895B] text-white px-4 py-2 rounded hover:bg-[#A25714]">
              Opslaan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
