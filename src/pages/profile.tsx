import { useState, useEffect } from "react";

type EditSightingData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};
import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import SectionTitle from "@/components/sectiontitle";
import Container from "@/components/container";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [editSightingModal, setEditSightingModal] = useState<any>(null);
  const [editSightingData, setEditSightingData] = useState({
    description: "",
    type: 1,
    flower: "",
    latitude: 0,
    longitude: 0,
    place: "",
    date: ""
  });
  // Delete sighting modal state
  const [deleteSightingModal, setDeleteSightingModal] = useState<any>(null);
  const [deletingSighting, setDeletingSighting] = useState(false);
  const [deleteSightingError, setDeleteSightingError] = useState("");
  const handleDeleteSighting = async () => {
    if (!deleteSightingModal) return;
    setDeletingSighting(true);
    setDeleteSightingError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://localhost:7235/api/sighting/delete/${deleteSightingModal.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      if (!res.ok) {
        let errorMsg = "Fout bij verwijderen";
        try {
          const errorData = await res.json();
          if (errorData && errorData.errors) {
            errorMsg = Object.values(errorData.errors).flat().join(" ");
          } else if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch {}
        throw new Error(errorMsg);
      }
      setDeleteSightingModal(null);
      await fetchSightings();
    } catch (err: any) {
      setDeleteSightingError(err.message || "Onbekende fout");
    } finally {
      setDeletingSighting(false);
    }
  };
  const [savingSighting, setSavingSighting] = useState(false);
  const [saveSightingError, setSaveSightingError] = useState("");

  const handleEditSightingClick = (sig: any) => {
    setEditSightingModal(sig);
    setEditSightingData({
      description: sig.description || "",
      type: sig.type || 1,
      flower: sig.flower || "",
      latitude: sig.latitude || 0,
      longitude: sig.longitude || 0,
      place: sig.place || "",
      date: sig.date ? sig.date.slice(0, 16) : ""
    });
    setSaveSightingError("");
  };

  const fetchSightings = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://localhost:7235/api/profile/sightings", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch sightings");
      const data = await res.json();
      const sightingsArr = Array.isArray(data.sighting) ? data.sighting : [];
      setSignaleringen(sightingsArr);
    } catch (err) {
      setSignaleringen([]);
    }
  };

  const handleSaveSighting = async () => {
    if (!editSightingModal) return;
    setSavingSighting(true);
    setSaveSightingError("");
    const token = localStorage.getItem("token");
    try {
      // Convert date to ISO string if needed
      let dateToSend = editSightingData.date;
      if (dateToSend && !dateToSend.endsWith("Z") && dateToSend.length <= 16) {
        dateToSend = new Date(dateToSend).toISOString();
      }
      const body = {
        ...editSightingData,
        date: dateToSend
      };
      const res = await fetch(`https://localhost:7235/api/sighting/update/${editSightingModal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      if (!res.ok) {
        let errorMsg = "Fout bij opslaan";
        try {
          const errorData = await res.json();
          if (errorData && errorData.errors) {
            errorMsg = Object.values(errorData.errors).flat().join(" ");
          } else if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch {}
        throw new Error(errorMsg);
      }
      setEditSightingModal(null);
      await fetchSightings();
    } catch (err: any) {
      setSaveSightingError(err.message || "Onbekende fout");
    } finally {
      setSavingSighting(false);
    }
  };
  const [signaleringen, setSignaleringen] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [active, setActive] = useState("profiel");
  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Editable profile fields for the modal
  const [editUsername, setEditUsername] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [newType, setNewType] = useState("");
  const options = ["Bij", "Hoornaar", "Bijenkorf", "Wespennest"];
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetch("https://localhost:7235/api/profile/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile info");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
    fetchSightings();
  }, []);

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
                <button onClick={() => router.push("logout")}
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
                {loadingProfile ? (
                  <p className="text-[21px] text-[#BE895B] mb-2">Laden...</p>
                ) : profile ? (
                  <>
                    <p className="text-[21px] text-[#BE895B] mb-2">Gebruikersnaam: {profile.username || "-"}</p>
                    <p className="text-[21px] text-[#BE895B] mb-2">E-mail: {profile.email || "-"}</p>
                    <p className="text-[21px] text-[#BE895B] mb-2">Voornaam: {profile.firstName || "-"}</p>
                    <p className="text-[21px] text-[#BE895B] mb-2">Achternaam: {profile.lastName || "-"}</p>
                  </>
                ) : (
                  <p className="text-[21px] text-[#BE895B] mb-2">Kon profiel niet laden.</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4 w-full justify-between my-4">
                <button
                  onClick={() => setActive("profiel")}
                  className="bg-[#FBD064] hover:bg-[#A25714] text-white px-7 py-2 rounded-full transition"
                >
                  Terug
                </button>
                <button
                  onClick={() => {
                    setEditUsername(profile?.username || "");
                    setEditFirstName(profile?.firstName || "");
                    setEditLastName(profile?.lastName || "");
                    setEditEmail(profile?.email || "");
                    setSaveError("");
                    setShowModal(true);
                  }}
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
              {Array.isArray(signaleringen) && signaleringen.length === 0 ? (
                <div className="text-[#BE895B] text-center">Geen signaleringen gevonden.</div>
              ) : (
                Array.isArray(signaleringen) && signaleringen.map((sig: any, idx: number) => {
                  const typeLabels: Record<number, string> = {
                    1: "Bij",
                    2: "Hoornaar",
                    3: "Bijenkorf",
                    4: "Wespennest"
                  };
                  const typeLabel = typeLabels[sig.type] || sig.type || "-";
                  const location = sig.place || sig.location || sig.Location || "-";
                  const plant = sig.flower || sig.plant || sig.Plant || "-";
                  let date = sig.date || sig.Date || "-";
                  if (date && date !== "-") {
                    try {
                      date = new Date(date).toLocaleDateString("nl-NL");
                    } catch {}
                  }
                  let weather = "-";
                  if (sig.weather && typeof sig.weather === "object") {
                    const weatherCodes: Record<number, string> = {
                      1: "Zonnig",
                      2: "Bewolkt",
                      3: "Regen",
                      4: "Windy"
                    };
                    weather = `${weatherCodes[sig.weather.code] || sig.weather.code || "Onbekend"} (${sig.weather.temperature}°C)`;
                  } else if (sig.weather || sig.Weather) {
                    weather = sig.weather || sig.Weather;
                  }
                  const description = sig.description || sig.Description || "-";
                  const images = Array.isArray(sig.images) ? sig.images : [];
                  return (
                    <div key={sig.id || idx} className="flex flex-col w-full bg-[#F0DFCD] rounded-2xl p-4">
                      <div className="text-[#BE895B] text-[26px]">
                        Signalering {idx + 1} <span className="text-[21px] text-[#FAC131] ml-4 ">{typeLabel}</span>
                      </div>
                      <div className="mb-[6px] h-[2px] w-full bg-white rounded-sm" />
                      <div className="text-[#BE895B] text-base space-y-2">
                        <div className="grid grid-cols-[100px_1fr] "><span>Locatie:</span><span className="text-[#FAC131]">{location}</span></div>
                        <div className="grid grid-cols-[100px_1fr] "><span>Plant:</span><span className="text-[#FAC131]">{plant}</span></div>
                        <div className="grid grid-cols-[100px_1fr] "><span>Datum:</span><span className="text-[#FAC131]">{date}</span></div>
                        <div className="grid grid-cols-[100px_1fr] "><span>Weer:</span><span className="text-[#FAC131]">{weather}</span></div>
                        <div><span>Beschrijving:</span> <br /><span className="text-[#FAC131]">{description}</span></div>
                      </div>
                      {images.length > 0 && (
                        <div className="flex flex-col space-y-2 mt-10 w-full relative">
                          <p className="text-[21px] text-[#BE895B]">Bekijk jouw foto's:</p>
                          <div className="flex flex-wrap gap-2 w-full">
                            {images.map((img: any, i: number) => (
                              <div key={img.url} className="w-[120px] h-[120px] bg-[#E3D8D8] rounded-2xl flex items-center justify-center overflow-hidden">
                                <img
                                  src={img.url}
                                  alt={`Foto ${i + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-4">
                        <button
                          className="bg-[#FBD064] hover:bg-[#A25714] text-white px-5 py-1 rounded-full transition"
                          onClick={() => handleEditSightingClick(sig)}
                        >
                          Wijzig signalering
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-5 py-1 rounded-full transition"
                          onClick={() => {
                            setDeleteSightingModal(sig);
                            setDeleteSightingError("");
                          }}
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
      {/* Delete sighting confirmation modal */}
      {deleteSightingModal && (
        <div className="fixed inset-0 bg-transparant bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#F0DFCD] rounded-2xl p-6 w-[350px] max-h-[80vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl mb-4 text-[#A25714]">Weet je zeker dat je deze signalering wilt verwijderen?</h2>
            <button
              onClick={() => setDeleteSightingModal(null)}
              className="absolute top-3 right-3 text-[#FBD064] hover:text-[#FAC131]"
            >
              ✕
            </button>
            {deleteSightingError && <div className="text-red-500 text-sm mb-2">{deleteSightingError}</div>}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
                disabled={deletingSighting}
                onClick={() => setDeleteSightingModal(null)}
              >
                Annuleren
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-full transition"
                disabled={deletingSighting}
                onClick={handleDeleteSighting}
              >
                {deletingSighting ? "Verwijderen..." : "Verwijder"}
              </button>
            </div>
          </div>
        </div>
      )}
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
      </Container>
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
            {active === "gegevens" && (
              <>
                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Bijnaam:</p>
                  <input
                    type="text"
                    name="new-username"
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">E-mail:</p>
                  <input
                    type="text"
                    name="new-email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Voornaam:</p>
                  <input
                    type="text"
                    name="new-firstname"
                    value={editFirstName}
                    onChange={e => setEditFirstName(e.target.value)}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>
                <div className="flex items-center mb-2">
                  <p className="text-[18px] text-[#BE895B] w-[100px]">Achternaam:</p>
                  <input
                    type="text"
                    name="new-lastname"
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 flex-1"
                  />
                </div>
                {saveError && <p className="text-red-500 text-sm mb-2">{saveError}</p>}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      setSaveError("");
                      const token = localStorage.getItem("token");
                      try {
                        const res = await fetch("https://localhost:7235/api/profile/me/update", {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            username: editUsername,
                            firstName: editFirstName,
                            lastName: editLastName,
                            email: editEmail,
                          }),
                        });
                        if (!res.ok) {
                          let errorMsg = "Fout bij opslaan";
                          try {
                            const errorData = await res.json();
                            if (errorData && errorData.errors) {
                              errorMsg = Object.values(errorData.errors)
                                .flat()
                                .join(" ");
                            } else if (errorData && errorData.message) {
                              errorMsg = errorData.message;
                            }
                          } catch {}
                          throw new Error(errorMsg);
                        }
                        setProfile({
                          ...profile,
                          username: editUsername,
                          firstName: editFirstName,
                          lastName: editLastName,
                          email: editEmail,
                        });
                        setShowModal(false);
                      } catch (err: any) {
                        setSaveError(err.message || "Onbekende fout");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    {saving ? "Opslaan..." : "Opslaan"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit sighting modal (only one at a time) */}
      {editSightingModal && (
        <div className="fixed inset-0 bg-transparant bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#F0DFCD] rounded-2xl p-6 w-[400px] max-h-[90vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl mb-4 text-[#A25714]">Signalering wijzigen</h2>
            <button
              onClick={() => setEditSightingModal(null)}
              className="absolute top-3 right-3 text-[#FBD064] hover:text-[#FAC131]"
            >
              ✕
            </button>
            <div className="flex flex-col space-y-2">
              <label className="text-[#BE895B]">Beschrijving:
                <textarea
                  value={editSightingData.description}
                  onChange={e => setEditSightingData({ ...editSightingData, description: e.target.value })}
                  className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full min-h-[60px]"
                  required minLength={5} maxLength={200}
                />
              </label>
              <label className="text-[#BE895B]">Type:
                <select
                  value={editSightingData.type}
                  onChange={e => setEditSightingData({ ...editSightingData, type: Number(e.target.value) })}
                  className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                >
                  <option value={1}>Bij</option>
                  <option value={2}>Hoornaar</option>
                  <option value={3}>Bijenkorf</option>
                  <option value={4}>Wespennest</option>
                </select>
              </label>
              <label className="text-[#BE895B]">Plant:
                <input
                  type="text"
                  value={editSightingData.flower}
                  onChange={e => setEditSightingData({ ...editSightingData, flower: e.target.value })}
                  className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                />
              </label>
              <label className="text-[#BE895B]">Locatie:
                <input
                  type="text"
                  value={editSightingData.place}
                  onChange={e => setEditSightingData({ ...editSightingData, place: e.target.value })}
                  className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                />
              </label>
              <div className="flex gap-2">
                <label className="text-[#BE895B] flex-1">Latitude:
                  <input
                    type="number"
                    value={editSightingData.latitude}
                    onChange={e => setEditSightingData({ ...editSightingData, latitude: parseFloat(e.target.value) })}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                    step="any"
                  />
                </label>
                <label className="text-[#BE895B] flex-1">Longitude:
                  <input
                    type="number"
                    value={editSightingData.longitude}
                    onChange={e => setEditSightingData({ ...editSightingData, longitude: parseFloat(e.target.value) })}
                    className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                    step="any"
                  />
                </label>
              </div>
              <label className="text-[#BE895B]">Datum:
                <input
                  type="date"
                  value={editSightingData.date ? editSightingData.date.slice(0, 10) : ''}
                  onChange={e => setEditSightingData({ ...editSightingData, date: e.target.value })}
                  className="bg-[#EFEEEC] text-[#BE895B] rounded-4xl px-2 w-full"
                  required
                />
              </label>
              {saveSightingError && (
                <div className="text-red-500 text-sm mb-2">{saveSightingError}</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#FBD064] hover:bg-[#A25714] text-white px-6 py-2 rounded-full transition"
                disabled={savingSighting}
                onClick={handleSaveSighting}
              >
                {savingSighting ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
}
