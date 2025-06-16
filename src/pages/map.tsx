import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import MapFilter from "@/components/mapfilter";
import Containermapfilter from "@/components/containermapfilter";
import MapLegenda from "@/components/maplegenda";


export default function Map() {
    return (

        <div className="home pb-[80px]">
            <Navbar />
            <header className="LogoSvg">
                <LogoSvg />
            </header>
            <Containermapfilter>

                <div className="">
                    <MapFilter />
                </div>

            </Containermapfilter>
            <MapLegenda />

        </div>

    );
}