import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const links = [
    { href: "/", label: "People" },
    { href: "/about", label: "About" },
    { href: "/database", label: "Database" },
    { href: "/github", label: "GitHub" },
  ];
  return (
    <header className="border-b border-border bg-surface/85 backdrop-blur sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-lg text-fg">
          Person<span className="text-accent-fg">App</span>
        </Link>
        <ul className="flex gap-1 sm:gap-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3 py-2 rounded-md text-fg-muted hover:bg-surface-2 hover:text-accent-fg transition"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
