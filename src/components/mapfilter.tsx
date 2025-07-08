import { useState } from "react";

type FilterType = "wasp" | "hive" | "weather";

export default function MapFilter() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const iconOffsets: Record<FilterType, number> = {
    wasp: 0,
    hive: 70,
    weather: 140,
  };

  const filterItems: Record<FilterType, string[]> = {
    wasp: ["Bij", "Hoornaar"],
    hive: ["Bijenkorf", "Wespennest"],
    weather: ["Zonnig", "Bewolkt", "Vriest", "Regen"],
  };

  const items: string[] = activeFilter ? filterItems[activeFilter] : [];
  const isMultiColumn: boolean = items.length > 3;

  return (
    <div className="relative flex flex-col space-y-2">
      <button
        onClick={() => {
          setIsOpen((prev: boolean) => {
            const newState = !prev;
            if (!newState) setActiveFilter(null); 
            return newState;
          });
        }}
        className="w-[58px] h-[58px] rounded-full bg-[#BE895B] flex items-center justify-center transition-all duration-300"
      >
        <img src="/icons/search.svg" alt="Search" className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 transition-all duration-300 flex items-start space-x-4">
          <div className="w-[58px] h-[184px] bg-[#BE895B] rounded-[30px] flex flex-col items-center justify-center space-y-6 relative">
            <button
              onClick={() => setActiveFilter((prev: FilterType | null) => prev === "wasp" ? null : "wasp")}
              className="transition-all duration-300"
            >
              <img src="/icons/wasp.svg" alt="Wasp" className="w-8 h-8" />
            </button>

            <button
              onClick={() => setActiveFilter((prev: FilterType | null) => prev === "hive" ? null : "hive")}
              className="transition-all duration-300"
            >
              <img src="/icons/hive.svg" alt="Hive" className="w-8 h-8" />
            </button>

            <button
              onClick={() => setActiveFilter((prev: FilterType | null) => prev === "weather" ? null : "weather")}
              className="transition-all duration-300"
            >
              <img src="/icons/weather.svg" alt="Weather" className="w-8 h-8" />
            </button>
          </div>

          {activeFilter && (
            <div
              className={`bg-[#BE895B]  px-4 py-2 rounded-2xl text-white  transition-all duration-300
                ${isMultiColumn ? "grid grid-cols-2 gap-3" : "flex gap-3"}`}
              style={{ alignSelf: "start", marginTop: activeFilter ? iconOffsets[activeFilter] : 0 }}
            >
              {items.map((item: string, index: number) => (
                <span
                  key={index}
                  className=" px-3 py-1 rounded-full whitespace-nowrap transition-all duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
