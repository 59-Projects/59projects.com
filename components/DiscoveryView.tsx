"use client";

import Link from "next/link";
import clsx from "clsx";
import { Footer } from "@/components/Footer";
import { LoopsGraphic } from "@/components/LoopsGraphic";
import { RecentProjects } from "@/components/RecentProjects";
import { useTheme } from "@/components/ThemeProvider";
import type { DiscoveryContent, ServiceItem } from "@/lib/schema";

const leadClasses =
  "mt-4 max-w-[20em] font-serif text-[clamp(32px,5vw,72px)] leading-[1.08] font-normal tracking-[-0.025em]";

const proseClasses =
  "max-w-[44em] text-[18px] leading-[1.6] font-normal opacity-90";

interface DiscoveryViewProps {
  discovery: DiscoveryContent;
}

/**
 * A simple title/body card grid, used for the three card-based sections on
 * this page ("What Discovery Is", the HCD principles, "Why We Prototype").
 * Bodies are rendered as plain text, matching the site's existing
 * `ServiceItem` convention (see `examples`/`capabilities` elsewhere), so
 * these can't carry inline citations, unlike the page's prose paragraphs.
 */
function CardGrid({
  items,
  columns,
  fg,
  bg,
}: {
  items: ServiceItem[];
  columns: 3 | 4;
  fg: string;
  bg: string;
}) {
  return (
    <div
      className={clsx(
        "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      )}
    >
      {items.map((item, index) => (
        <div key={item.title} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold"
            style={{ background: fg, color: bg }}
          >
            {index + 1}
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold tracking-[-0.01em]">
              {item.title}
            </h3>
            <p className="text-[17px] leading-[1.5] opacity-80">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiscoveryView({ discovery }: DiscoveryViewProps) {
  const { isDark } = useTheme();
  // Swapped in dark mode, same as a project page's `bg`/`fg`.
  const bg = isDark ? discovery.fg : discovery.bg;
  const fg = isDark ? discovery.bg : discovery.fg;
  // The "What Discovery Is" box: white with the page's dark blue as ink, in
  // both modes. To revert to the tinted box, use
  // `color-mix(in srgb, ${fg} 25%, ${bg})` for the panel and `fg` for the ink.
  const panel = "#ffffff";
  const panelInk = discovery.fg;

  return (
    <div
      className="discovery-page min-h-screen w-full"
      style={{ background: bg, color: fg }}
    >
      <div className="h-[78px] w-full" />

      {/* HERO */}
      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-10 sm:pt-10 sm:pb-16">
        <p
          className="max-w-[36em] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] sm:text-[42px] sm:leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: discovery.hero }}
        />
        <p
          className="mt-3 max-w-[40em] text-xl leading-[1.4] font-normal opacity-75 sm:text-2xl"
          dangerouslySetInnerHTML={{ __html: discovery.deck }}
        />
      </div>

      {/* WHAT DISCOVERY IS */}
      <div className="w-full px-[clamp(20px,2.5vw,40px)] py-6 sm:py-10">
        <div
          className="p-[clamp(24px,4vw,72px)]"
          style={{ background: panel, color: panelInk }}
        >
          <h2 className="text-sm font-semibold tracking-[0.06em] uppercase">
            What Discovery Is
          </h2>
          <p
            className={leadClasses}
            dangerouslySetInnerHTML={{ __html: discovery.whatDiscoveryIsLead }}
          />
          <CardGrid
            items={discovery.whatDiscoveryIsCards}
            columns={3}
            fg={panelInk}
            bg={panel}
          />
          <LoopsGraphic className="mt-12 h-auto w-full" bg={panel} />
          <p
            className={`${proseClasses} mt-6`}
            dangerouslySetInnerHTML={{ __html: discovery.loopsNote }}
          />
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <RecentProjects projects={discovery.examples} bg={bg} fg={fg} />

      {/* ONE CTA */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-16 text-center sm:py-20"
        style={{ background: fg, color: bg }}
        id="contact"
      >
        <p
          className="mx-auto max-w-[16em] font-serif text-[clamp(30px,4.5vw,64px)] leading-[1.08] font-normal tracking-[-0.025em] text-balance"
          dangerouslySetInnerHTML={{ __html: discovery.closingHeading }}
        />
        <p
          className="mx-auto mt-4 max-w-[34em] text-lg leading-[1.5] text-balance opacity-80"
          dangerouslySetInnerHTML={{ __html: discovery.closing }}
        />
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href={discovery.ctaPrimary.href}
            className="rounded-[2px] px-5 py-3 text-sm font-semibold hover:opacity-80"
            style={{ background: bg, color: fg }}
          >
            {discovery.ctaPrimary.text} →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
