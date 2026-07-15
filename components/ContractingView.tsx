"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Prose } from "@/components/Prose";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { ContractingContent } from "@/lib/schema";

/** Matches the `--color-cream` / `--color-ink` theme tokens in globals.css. */
const CREAM = "#f4f2ec";
const INK = "#1a1916";

interface ContractingViewProps {
  contracting: ContractingContent;
}

export function ContractingView({ contracting }: ContractingViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div className="h-[78px] w-full" />

      <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-24 sm:pt-24 sm:pb-[100px]">
        {contracting.photo ? (
          <ImagePlaceholder
            src={contracting.photo}
            alt={contracting.title}
            fg={fg}
            sizes="220px"
            minWidth={220}
            className="mb-9 h-[220px] w-[220px] rounded-full"
          />
        ) : null}

        <Prose
          html={contracting.bodyHtml}
          color={fg}
          className="contracting-prose max-w-[42em] text-[18px] leading-[1.6] font-normal opacity-90"
        />
      </div>

      <Footer />
    </div>
  );
}
