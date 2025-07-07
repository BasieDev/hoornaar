import { useState } from "react";
import LogoSvg from "@/components/logo";
import { useEffect } from "react";
import Router from "next/router";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [debug, setDebug] = useState<any>(null);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         window.location.href = "/login";
    //     }
    // }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setDebug(null);
        try {
            const res = await fetch("https://localhost:7235/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const text = await res.text();

            if (!res.ok) {
                try {
                  const json = JSON.parse(text);
              
                  if (json.errors) {
                    setError(json.errors);
                  } 
                  else {
                    setError(json.detail || json.title || "Er is iets misgegaan.");
                  }
                } catch {
                  setError(text || "Er is iets misgegaan.");
                }
                return;
              }
              
            localStorage.setItem("token", text);
            console.log("Token opgeslagen:", text);
            Router.push("/");
            setSuccess(true);
            setDebug({ status: res.status, statusText: res.statusText, body: text });

        } catch (err: any) {
            setError("Kan geen verbinding maken met de server.");
            setDebug({ error: err?.toString() });
        }
    };

    return (
        <div>
            <header className="LogoSvg">
                <LogoSvg />
            </header>
            <div className="flex flex-col items-center justify-center">
                <form className="mt-12" onSubmit={handleSubmit}>
                    <div className="w-72 flex flex-col">
                        <label className="text-xl ml-4">Gebruikersnaam</label>
                        <input
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            className="bg-[#F1DECD] h-12 rounded-4xl text-black"
                        />
                    </div>
                    <div className="w-72 flex flex-col mt-8">
                        <label className="text-xl ml-4">Voornaam</label>
                        <input
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            className="bg-[#F1DECD] h-12 rounded-4xl text-black"
                        />
                    </div>
                    <div className="w-72 flex flex-col mt-8">
                        <label className="text-xl ml-4">Achternaam</label>
                        <input
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            className="bg-[#F1DECD] h-12 rounded-4xl text-black"
                        />
                    </div>
                    <div className="w-72 flex flex-col mt-8">
                        <label className="text-xl ml-4">E-mailadres</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="bg-[#F1DECD] h-12 rounded-4xl text-black"
                        />
                    </div>
                    <div className="w-72 flex flex-col mt-8">
                        <label className="text-xl ml-4">Wachtwoord</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-[#F1DECD] h-12 rounded-4xl text-black"
                        />
                    </div>
                    <div className="mx-auto ml-4">
                        Heb je al een account? <a href="/login" className="text-[#F1DECD]">Klik hier.</a>
                    </div>
                    <div>
                        <button type="submit" className="bg-[#FBD064] text-[#fffff] text-xl h-12 w-36 mt-8 rounded-4xl float-right" style={{ width: '50%' }}>
                            Registreer
                        </button>
                    </div>
                    {typeof error === "string" && (
                        <div className="text-red-600 mt-4">{error}</div>
                    )}

                    {typeof error === "object" && (
                      <div className="text-red-600 mt-4">
                        {Object.entries(error).map(([field, messages]) => (
                          <div key={field}>
                            {(messages as string[]).map((msg, idx) => (
                               <p key={idx}>{msg}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {success && <div className="text-green-600 mt-4">Registratie gelukt!</div>}
                </form>
            </div>
        </div>
    );
}
