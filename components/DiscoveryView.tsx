"use client";

import { Prose } from "@/components/Prose";
import { Quote } from "@/components/Quote";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { DiscoveryContent } from "@/lib/schema";

const sectionLabelClasses =
  "text-sm font-semibold tracking-[0.06em] uppercase opacity-55";

const proseClasses =
  "max-w-[44em] text-[18px] leading-[1.6] font-normal opacity-90";

// Same type styling as `proseClasses`, but no max-width, since this one
// lives inside the intro box below, which sets its own (wider) width.
const boxProseClasses = "text-[18px] leading-[1.6] font-normal opacity-90";

interface DiscoveryViewProps {
  discovery: DiscoveryContent;
}

export function DiscoveryView({ discovery }: DiscoveryViewProps) {
  const { isDark } = useTheme();
  // Swapped in dark mode, same as a project page's `bg`/`fg`.
  const bg = isDark ? discovery.fg : discovery.bg;
  const fg = isDark ? discovery.bg : discovery.fg;

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div className="h-[78px] w-full" />

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-10 sm:pt-10 sm:pb-16">
        <p
          className="max-w-[36em] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] sm:text-[42px] sm:leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: discovery.hero }}
        />
        {discovery.deck ? (
          <p
            className="mt-3 max-w-[40em] text-xl leading-[1.4] font-normal opacity-75 sm:text-2xl"
            dangerouslySetInnerHTML={{ __html: discovery.deck }}
          />
        ) : null}
      </div>

      <div className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
        <h2 className={sectionLabelClasses}>What We Do</h2>
        <div className="mt-6 flex flex-col">
          {discovery.whatWeDo.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10"
              style={index > 0 ? { borderTop: `1px solid ${fg}1f` } : undefined}
            >
              <span className="flex-none text-lg font-bold tabular-nums opacity-40 sm:w-10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="flex-none text-xl font-bold tracking-[-0.01em] sm:w-[240px]">
                {item.title}
              </h3>
              <p className="max-w-[44em] text-base leading-[1.55] opacity-80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {discovery.bodyHtml2 ? (
        <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
          <Prose html={discovery.bodyHtml2} color={fg} className={proseClasses} />
        </div>
      ) : null}

      {discovery.quote ? <Quote html={discovery.quote} color={fg} /> : null}

      {discovery.bodyHtml2b ? (
        <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
          <Prose html={discovery.bodyHtml2b} color={fg} className={proseClasses} />
        </div>
      ) : null}

      {/*
        Deliberately the opposite of the page's own `bg`/`fg` above (not a
        third color), so it always contrasts with the rest of the page.
      */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ background: fg, color: bg }}
      >
        <h2 className={sectionLabelClasses}>Recent Projects</h2>
        <div className="mt-6 flex flex-col">
          {discovery.examples.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10"
              style={index > 0 ? { borderTop: `1px solid ${bg}30` } : undefined}
            >
              <span className="flex-none text-lg font-bold tabular-nums opacity-40 sm:w-10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="flex-none text-xl font-bold tracking-[-0.01em] sm:w-[240px]">
                {item.title}
              </h3>
              <p className="max-w-[44em] text-base leading-[1.55] opacity-80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <Prose
          html={discovery.bodyHtml}
          color={bg}
          className={`${proseClasses} mt-10 mx-auto text-center inherit-color-link`}
        />
      </div>

      {discovery.bodyHtml3 ? (
        <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
          <Prose html={discovery.bodyHtml3} color={fg} className={proseClasses} />
        </div>
      ) : null}

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-20 text-center">
        <p
          className="inherit-color-link mx-auto max-w-[32em] text-xl leading-[1.4] font-medium tracking-[-0.01em]"
          dangerouslySetInnerHTML={{ __html: discovery.closing }}
        />
      </div>

      <Footer />
    </div>
  );
}
