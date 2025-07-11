import { ReactNode } from "react";

interface SectionTitleProps {
  title: ReactNode;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="relative w-fit mt-18 ">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-[#F5B800] text-[26px]">{title}</h2>
        <img
          src="/icons/bee.svg"
          alt="Bij icoon"
          className="w-6 h-5 mb-5 "
        />
      </div>
      <div className="my-2 h-[2px] w-full bg-[#8B4A00] rounded-sm" />
    </div>
  );
}