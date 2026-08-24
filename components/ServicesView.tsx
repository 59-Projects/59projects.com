"use client";

import { Prose } from "@/components/Prose";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { ServicesContent } from "@/lib/schema";

const sectionLabelClasses =
  "text-sm font-semibold tracking-[0.06em] uppercase opacity-55";

interface ServicesViewProps {
  services: ServicesContent;
}

export function ServicesView({ services }: ServicesViewProps) {
  const { isDark } = useTheme();
  // Swapped in dark mode, same as a project page's `bg`/`fg`.
  const bg = isDark ? services.fg : services.bg;
  const fg = isDark ? services.bg : services.fg;

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div className="h-[78px] w-full" />

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-10 sm:pt-10 sm:pb-16">
        <p
          className="max-w-[36em] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] sm:text-[42px] sm:leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: services.hero }}
        />
        {services.deck ? (
          <p
            className="mt-3 max-w-[40em] text-xl leading-[1.4] font-normal opacity-75 sm:text-2xl"
            dangerouslySetInnerHTML={{ __html: services.deck }}
          />
        ) : null}
      </div>

      <div className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
        <h2 className={sectionLabelClasses}>What We Do</h2>
        <div className="mt-6 flex flex-col">
          {services.capabilities.map((item, index) => (
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
              <p className="max-w-[42em] text-base leading-[1.55] opacity-80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/*
        Deliberately the opposite of the page's own `bg`/`fg` above (not a
        third color), so it always contrasts with the rest of the page. It
        still flips correctly with the toggle because `bg`/`fg` are already
        the isDark-swapped values, just used in reverse roles here.
      */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ background: fg, color: bg }}
      >
        <h2 className={sectionLabelClasses}>How We Work</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-4">
          {services.process.map((item, index) => (
            <div key={item.title} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold"
                  style={{ border: `1.5px solid ${bg}` }}
                >
                  {index + 1}
                </span>
                {index < services.process.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 sm:block"
                    style={{ background: `${bg}30` }}
                  />
                ) : null}
              </div>
              <h3 className="text-lg font-bold tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.55] opacity-80">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
        <Prose
          html={services.bodyHtml}
          color={fg}
          className="max-w-[42em] text-[18px] leading-[1.6] font-normal opacity-90"
        />
      </div>

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-20 text-center">
        <p
          className="inherit-color-link mx-auto max-w-[32em] text-xl leading-[1.4] font-medium tracking-[-0.01em]"
          dangerouslySetInnerHTML={{ __html: services.closing }}
        />
      </div>

      <Footer />
    </div>
  );
}
