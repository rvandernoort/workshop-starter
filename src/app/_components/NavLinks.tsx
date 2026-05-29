"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-6 text-sm font-medium">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={
            pathname === href
              ? "hw-gradient-text"
              : "text-hw-off-white/70 hover:text-hw-off-white transition-colors"
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
