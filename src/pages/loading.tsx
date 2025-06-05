import { useState, useEffect } from 'react';
import ProgressBar from '../components/progressbar';
import LogoSvg from '@/components/logo';
import Loadingspinner from '../components/loadingspinner'; 

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="LogoSvg">
        <LogoSvg />
      </header>

      <div className="flex flex-col items-center justify-center space-y-8 w-full px-4" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Loadingspinner />
        <ProgressBar percentage={progress} />
        <span className="text-sm text-[#FBD064] mt-5 ">{progress}%</span>
      </div>
    </>
  );
}
