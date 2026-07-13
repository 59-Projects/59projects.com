import Link from "next/link";
import { LEGAL_NAME, LOCATION, LINKEDIN_URL } from "@/content/site";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contracting", label: "Contracting" },
  { href: "/contact", label: "Contact" },
];

const linkClasses =
  "text-xs font-medium tracking-[0.06em] uppercase opacity-80 transition-opacity hover:opacity-100";

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
          <Link key={link.href} href={link.href} className={linkClasses}>
            {link.label}
          </Link>
        ))}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          LinkedIn
        </a>
      </nav>
      <span className="mt-3 block text-xs font-medium tracking-[0.06em] uppercase opacity-55">
        {LEGAL_NAME} • {LOCATION}
      </span>
    </div>
  );
}
