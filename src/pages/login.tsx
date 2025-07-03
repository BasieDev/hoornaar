import { useState } from "react";
import LogoSvg from "@/components/logo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {

  useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/";
        }
    }, []);
  
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      // Send email as username in the payload
      const payload = {
        username: form.email,
        password: form.password
      };
      const res = await fetch("http://localhost:5024/api/auth/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (!res.ok) {
        setError(`Login mislukt. Server response: ${text}`);
        return;
      }
      localStorage.setItem("token", text);
      setSuccess(true);
      router.push("/");
    } catch (err: any) {
      setError(`Kan geen verbinding maken met de server. Fout: ${err?.toString?.() || err}`);
    }
  };

  return (
    <div>
      <header className="LogoSvg">
        <LogoSvg />
      </header>
      <div className="flex flex-col items-center justify-center">
        <form className="mt-22" onSubmit={handleSubmit}>
          <div className="w-72 flex flex-col">
            <label className="text-xl ml-4" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }}>E-mailadres</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="bg-[#F1DECD] p-2 text-xl text-black h-12 rounded-4xl"
              style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif'}}
            />
          </div>
          <div className="w-72 flex flex-col mt-8">
            <label className="text-xl ml-4" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }}>Wachtwoord</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="bg-[#F1DECD] p-2 h-12 rounded-4xl text-xl text-black"
              style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif'}}
            />
          </div>
          <div style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }} className="mx-auto ml-4">
            Nog geen account? <a href="/register" className="text-[#F1DECD]" >Klik hier.</a>
          </div>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {success && <div className="text-green-600 mt-4">Login gelukt!</div>}
          <div>
            <button type="submit" className="bg-[#FBD064] text-[#fffff] text-xl h-12 w-36 mt-8 rounded-4xl float-right" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif', width: '50%' }}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
