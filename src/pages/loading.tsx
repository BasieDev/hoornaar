import { useState, useEffect } from 'react';
import ProgressBar from '../components/progressbar';

export default function Home() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="relative w-full h-auto">
        <img src="/svg/bannermedium.svg" alt="Header Image" className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/svg/Middlelogo.png" alt="Centered Logo" className="h-20 mt-21 w-auto" />
        </div>
      </header>

      <div className="flex flex-col items-center justify-center space-y-4 mt-8 w-full px-4">
        <ProgressBar percentage={progress} />
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
    </>
  );
}
