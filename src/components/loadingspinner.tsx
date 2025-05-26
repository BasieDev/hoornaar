export default function LoadingSpinner() {
  return (
    <div className="flex justify-center ">
      <div className="relative w-16 h-16">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-4 bg-[#FAC131] rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-20px)`,
              animation: `fade 1.2s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
