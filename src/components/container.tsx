export default function Container({ children }) {
  return (
    <div className="px-8 sm:px-9 max-w-full sm:max-w-7xl mx-auto">
      {children}
    </div>
  );
}