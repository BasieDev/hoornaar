import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import OpenStreetMap from '../components/OpenStreetMap';

export default function Map() {
    return (
        <div className="home min-h-screen h-screen flex flex-col">
            <Navbar />
            <div className="relative flex-1 flex flex-col">
                {/* LogoSvg is the wavy top background, absolutely positioned */}
                <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
                    <LogoSvg />
                </div>
                <div className="flex-1 flex flex-col z-0 pt-[55px] pb-0 h-full min-h-0">
                    {/* Make map stretch to fill all available vertical space */}
                    <OpenStreetMap />
                </div>
            </div>
        </div>
    );
}