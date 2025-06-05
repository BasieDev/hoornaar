export default function LogoSvg() {
    return (
        <header className="relative w-full h-auto">
            <img src="/svg/bannermedium.svg" alt="Header Image" className="w-full h-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
                <img src="/svg/Middlelogo.png" alt="Centered Logo" className="h-20 mt-21 w-auto" />
            </div>
        </header>
    );
}