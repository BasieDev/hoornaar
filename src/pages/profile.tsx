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

        <div className="mt-4 flex justify-between">
          {(active === "signaleringen" || active === "gegevens") && (
            <div className="flex space-x-4 w-full justify-right ">
              <button
                onClick={() => setActive("profiel")}
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 rounded-full transition"
              >
                Terug
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 rounded-full transition"
              >
                Wijzig
              </button>
            </div>
          )}
        </div>
      </Container>

      {showModal && (
        <div className="fixed inset-0 bg-transparant bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#F0DFCD] rounded-2xl p-6 w-[350px] shadow-lg relative">

            <h2 className="text-xl  mb-4 text-[#A25714] ">
              {active === "gegevens" ? "Gegevens wijzigen" : "Signaleringen wijzigen"}
            </h2>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-[#FBD064] hover:text-[#FAC131]"
            >
              ✕
            </button>
            <div className="flex items-center mb-2">
              <p className="text-[18px] text-[#BE895B] w-[100px]">Bijnaam:</p>
              <input
                type="text"
                name="new-nickname"
                className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
              />
            </div>

            <div className="flex items-center mb-2">
              <p className="text-[18px] text-[#BE895B] w-[100px]">E-mail:</p>
              <input
                type="text"
                name="new-email"
                className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
              />
            </div>

            <div className="flex items-center mb-2">
              <p className="text-[18px] text-[#BE895B] w-[100px]">Voornaam:</p>
              <input
                type="text"
                name="new-firstname"
                className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
              />
            </div>

            <div className="flex items-center mb-2">
              <p className="text-[18px] text-[#BE895B] w-[100px]">Achternaam:</p>
              <input
                type="text"
                name="new-lastname"
                className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition">
                Opslaan
              </button>
            </div>
          </div>

        </div>


      )
      }
    </div >
  );
}
