import Navbar from "@/components/navbar";
import LogoSvg from "@/components/logo";
import MapFilter from "@/components/mapfilter";
import Containermapfilter from "@/components/containermapfilter";
import MapLegenda from "@/components/maplegenda";

import OpenStreetMap from '../components/OpenStreetMap';
import { useEffect } from "react";

export default function Map() {
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         window.location.href = "/login";
    //     }
    // }, []);

    return (
        <div className="home min-h-screen h-screen flex flex-col">
            <Navbar />
            <div className="relative flex-1 flex flex-col">
                <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
                    <LogoSvg />
                </div>
                <div className="flex-1 flex flex-col z-0 pt-[55px] pb-0 h-full min-h-0">
                    <OpenStreetMap />
                </div>
            </div>
            <Containermapfilter>

                <div className="">
                    <MapFilter />
                </div>

            </Containermapfilter>
            <MapLegenda />

        </div>

    );
}