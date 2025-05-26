import LogoSvg from "@/components/logo";

export default function Login() {
  return (
    <div>
        <header className="LogoSvg">
            <LogoSvg />
        </header>
        <div className="flex flex-col items-center justify-center">
            <form className="mt-22" action="/api/login">
                <div className="w-72 flex flex-col">
                    <label className="text-xl ml-4" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }}>Gebruikersnaam</label>
                    <input type="text" className="bg-[#F1DECD] p-2 text-xl text-black h-12 rounded-4xl" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif'}}/>
                </div>
                <div className="w-72 flex flex-col mt-8">
                    <label className="text-xl ml-4" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }}>Wachtwoord</label>
                    <input type="password" className="bg-[#F1DECD] p-2 h-12 rounded-4xl text-xl text-black" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif'}}/>
                </div>
                <div style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }} className="mx-auto ml-4">
                    Nog geen account? <a href="/register" className="text-[#F1DECD]" >Klik hier.</a>
                </div>
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
