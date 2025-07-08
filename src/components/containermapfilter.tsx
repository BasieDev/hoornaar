
import { ReactNode } from "react";

interface ContainermapfilterProps {
  children: ReactNode;
}

export default function Containermapfilter({ children }: ContainermapfilterProps) {
  return (
    <div className="px-[13px]  max-w-full ">
      {children}
    </div>
  );
}
