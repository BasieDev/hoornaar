type ProgressBarProps = {
  percentage: number;
};

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="w-[220px] bg-[#D19A5B] mt-8 rounded-full h-[50px] overflow-hidden flex items-center justify-start">
      <div
        className="h-full transition-all duration-300 rounded-full bg-[#FBC02D]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}