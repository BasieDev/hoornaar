import LoadingSpinner from '../components/loadingspinner';

export default function Home() {
  return (
    <>
        <header className="relative w-full h-auto">
            <img src="/svg/bannermedium.svg" alt="Header Image" className="w-full h-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
                <img src="/svg/Middlelogo.png" alt="Centered Logo" className="h-20 mt-21 w-auto" />
            </div>
        </header>
        <div className="flex flex-col items-center justify-center">
            <LoadingSpinner />
            <div className="text-2xl mt-4" style={{ fontFamily: 'Londrina, Arial, Helvetica, sans-serif' }}>
                Even geduld a.u.b.
            </div>
        </div>
    </>
  );
}