"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Prose } from "@/components/Prose";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { ContactContent } from "@/lib/schema";

/** Matches the `--color-cream` / `--color-ink` theme tokens in globals.css. */
const CREAM = "#f4f2ec";
const INK = "#1a1916";

interface ContactViewProps {
  contact: ContactContent;
}

export function ContactView({ contact }: ContactViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: bg, color: fg }}
    >
      <div className="h-[78px] w-full" />

      <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-24 sm:pt-24 sm:pb-[100px]">
        <ImagePlaceholder
          src={contact.photo}
          alt={contact.name}
          fg={fg}
          sizes="220px"
          className="h-[220px] w-[220px] rounded-full"
        />

        <Prose
          html={contact.bodyHtml}
          color={fg}
          className="mt-9 max-w-[42em] text-[18px] leading-[1.6] font-normal opacity-90"
        />
      </div>

      <Footer />
    </div>
  );
}
