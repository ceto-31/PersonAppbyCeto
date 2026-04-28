import Link from "next/link";

export default function NavBar() {
  const links = [
    { href: "/", label: "People" },
    { href: "/about", label: "About" },
    { href: "/database", label: "Database" },
    { href: "/github", label: "GitHub" },
  ];
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-slate-900">
          Person<span className="text-indigo-600">App</span>
        </Link>
        <ul className="flex gap-1 sm:gap-3 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
