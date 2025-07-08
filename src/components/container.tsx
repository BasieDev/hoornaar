import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="px-8 sm:px-9 max-w-full sm:max-w-7xl ">
      {children}
    </div>
  );
}