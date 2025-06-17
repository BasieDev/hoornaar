import { useState } from "react";
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import SectionTitle from "@/components/sectiontitle";
import Container from "@/components/container";
import { useEffect } from "react";


export default function Profile() {
  const [signaleringen, setSignaleringen] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [active, setActive] = useState("profiel");
  const [showModal, setShowModal] = useState(false);

  const [newType, setNewType] = useState("");
  const options = ["Bij", "Hoornaar", "Bijenkorf", "Wespennest"];


  const title =
    active === "profiel"
      ? "Mijn Profiel"
      : active === "signaleringen"
        ? "Mijn signaleringen"
        : "Mijn gegevens";

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="profile pb-[80px] min-h-screen flex flex-col relative">
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
            <div>
              <p className="text-[#BE895B]">
                Welkom op jouw profielpagina. <br />
                Hier kan je je gegevens inzien en wijzigen, maar ook je gemaakte signaleringen bekijken en wijzigen.
              </p>

              <div className="flex space-x-4 w-full justify-end mt-4">
                <button
                  className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 my-4 rounded-full transition"
                >
                  Log uit
                </button>
              </div>
            </div>
          )}


          {active === "gegevens" && (
            <div className="flex flex-col space-y-1 w-full">
              <div>
                <p className="text-[21px] text-[#BE895B] mb-2">Bijnaam:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">E-mail:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">Voornaam:</p>
                <p className="text-[21px] text-[#BE895B] mb-2">Achternaam:</p>
              </div>
              <div className="flex flex-wrap gap-4 w-full justify-between my-4">
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
            </div>
          )}

        </div>
        {/* API DATA */}
        <div className="mt-4 flex justify-between">
          {active === "signaleringen" && (
            <div className="flex flex-col space-y-6 w-full">
              <div className="flex flex-col w-full bg-[#F0DFCD] rounded-2xl p-4">
                <div className="text-[#BE895B]  text-[26px] ">
                  Signalering 1 <span className="text-[21px] text-[#FAC131] ml-4 ">Bij</span>
                </div>

                <div className="mb-[6px]  h-[2px] w-full bg-white rounded-sm" />



                <div className="text-[#BE895B] text-base space-y-2">
                  <div className="grid grid-cols-[100px_1fr] ">
                    <span>Locatie:</span>
                    <span className="text-[#FAC131]">Via api</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] ">
                    <span>Plant:</span>
                    <span className="text-[#FAC131]">Roos</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] ">
                    <span>Datum:</span>
                    <span className="text-[#FAC131]">alleen huidige dag of verleden</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] ">
                    <span>Weer:</span>
                    <span className="text-[#FAC131]">Via api</span>
                  </div>
                  <div>
                    <span>Beschrijving:</span> <br />
                    <span className="text-[#FAC131]">Hier komt de beschrijving .</span>
                  </div>
                </div>


                <div className="flex flex-col space-y-2 mt-10 w-full relative">

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

                  {/* OPEN MODEL WIJZIG MIJN SIGNALERING */}
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 rounded-full transition self-end sm:self-center"
                  >
                    Wijzig
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 w-full justify-right">
                <button
                  onClick={() => setActive("profiel")}
                  className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 my-4 rounded-full transition"
                >
                  Terug
                </button>
              </div>
            </div>
          )}
        </div>
      </Container >
      {/* MODEL WIJZIGEN SIGNALERINGEN & PROFIEL WIJZIGEN */}
      {showModal && (
        <div className="fixed inset-0 bg-transparant bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#F0DFCD] rounded-2xl p-6 w-[350px] max-h-[80vh] overflow-y-auto shadow-lg relative">

            <h2 className="text-xl mb-4 text-[#A25714]">
              {active === "gegevens" ? "Gegevens wijzigen" : "Signaleringen wijzigen"}
            </h2>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-[#FBD064] hover:text-[#FAC131]"
            >
              ✕
            </button>
            {/* voor gegevens wijzigen */}
            {active === "gegevens" ? (
              <>
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
              </>
            ) : (
              <>
                {/* voor signaleringen wijzigen */}
                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Wat:</p>
                  <select
                    name="new-type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  >
                    <option value="" disabled>Maak een keuze</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                </div>

                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Locatie:</p>
                  <input
                    type="text"
                    name="new-location"
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Plant:</p>
                  <input
                    type="text"
                    name="new-plant"
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Datum:</p>
                  <input
                    type="date"
                    name="new-date"
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Weer:</p>
                  <input
                    type="text"
                    name="new-weather"
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>

                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Beschrijving:</p>
                  <textarea
                    name="new-description"
                    required minLength={20} maxLength={200}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end mt-4">
              <button className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition">
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
}
