import Link from "next/link";
import { LEGAL_NAME, LOCATION } from "@/content/site";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Always a fixed dark background with light text, independent of the page
 * above it (project takeover colors, dark mode toggle, etc.) so it reads as
 * one consistent site-wide footer everywhere.
 */
export function Footer() {
  return (
    <div className="bg-ink text-cream w-full px-[clamp(20px,2.5vw,40px)] py-[28px] text-center">
      <nav className="flex items-center justify-center gap-6">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium tracking-[0.06em] uppercase opacity-80 transition-opacity hover:opacity-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="mt-3 block text-xs font-medium tracking-[0.06em] uppercase opacity-55">
        {LEGAL_NAME} • {LOCATION}
      </span>
    </div>
  );
}
