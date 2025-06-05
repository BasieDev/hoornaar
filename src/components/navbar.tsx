import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full h-[80px] bg-[#F0DFCD] flex items-center justify-around px-4 z-50">
      <Link href="/">
        <img src="/icons/house.svg" alt="Home" className="w-10 h-10" />
      </Link>
      <Link href="/map">
        <img src="/icons/card.svg" alt="Card" className="w-10 h-10" />
      </Link>
      <Link href="/add">
        <img src="/icons/add.svg" alt="Add" className="w-10 h-10" />
      </Link>
      <Link href="/profile">
        <img src="/icons/profile.svg" alt="Profile" className="w-10 h-10" />
      </Link>
    </nav>
  );
}
