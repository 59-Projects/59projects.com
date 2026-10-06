"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Prose } from "@/components/Prose";
import { Quote } from "@/components/Quote";
import { Footer } from "@/components/Footer";
import { RecentProjects } from "@/components/RecentProjects";
import { useTheme } from "@/components/ThemeProvider";
import type { DiscoveryContent, ServiceItem } from "@/lib/schema";

const sectionLabelClasses =
  "text-sm font-semibold tracking-[0.06em] uppercase opacity-55";

const leadClasses =
  "mt-3 max-w-[26em] text-[24px] leading-[1.25] font-medium tracking-[-0.02em] sm:text-[32px]";

const proseClasses =
  "max-w-[44em] text-[18px] leading-[1.6] font-normal opacity-90";

const HCD_LOOP = ["Understand", "Explore", "Test", "Refine"];

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
}: {
  items: ServiceItem[];
  columns: 3 | 4;
  fg: string;
}) {
  return (
    <div
      className={clsx(
        "mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      )}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="flex flex-col gap-2 rounded-sm p-4"
          style={{ border: `1px solid ${fg}33` }}
        >
          <h3 className="text-lg font-bold tracking-[-0.01em]">
            {item.title}
          </h3>
          <p className="text-[15px] leading-[1.55] opacity-80">{item.body}</p>
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
        {discovery.deck ? (
          <p
            className="mt-3 max-w-[40em] text-xl leading-[1.4] font-normal opacity-75 sm:text-2xl"
            dangerouslySetInnerHTML={{ __html: discovery.deck }}
          />
        ) : null}
      </div>

      {/*
        STAT BAND. Deliberately the opposite of the page's own bg/fg (not a
        third color), same convention as Recent Projects below, so it always
        contrasts with the rest of the page.
      */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ background: fg, color: bg }}
      >
        <p
          className="max-w-[40em] text-lg leading-[1.5] opacity-85 sm:text-xl"
          dangerouslySetInnerHTML={{ __html: discovery.statProblem }}
        />
        <p
          className="mt-4 max-w-[22em] text-[32px] leading-[1.1] font-bold tracking-[-0.02em] sm:text-[44px]"
          dangerouslySetInnerHTML={{ __html: discovery.statAnswer }}
        />
      </div>

      {/* WHAT DISCOVERY IS */}
      <div className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
        <h2 className={sectionLabelClasses}>What Discovery Is</h2>
        <p
          className={leadClasses}
          dangerouslySetInnerHTML={{ __html: discovery.whatDiscoveryIsLead }}
        />
        <CardGrid items={discovery.whatDiscoveryIsCards} columns={3} fg={fg} />
        {discovery.bodyHtml2 ? (
          <div className="mt-8">
            <Prose html={discovery.bodyHtml2} color={fg} className={proseClasses} />
          </div>
        ) : null}
      </div>

      {/* GROUNDED IN HUMAN-CENTERED DESIGN */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className={sectionLabelClasses}>
          Grounded in Human-Centered Design
        </h2>
        <p
          className={leadClasses}
          dangerouslySetInnerHTML={{ __html: discovery.hcdLead }}
        />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {HCD_LOOP.map((label, index) => (
            <span key={label} className="flex items-center gap-2">
              <span
                className="rounded-full px-4 py-2 text-sm font-bold"
                style={{ background: fg, color: bg }}
              >
                {label}
              </span>
              {index < HCD_LOOP.length - 1 ? (
                <span aria-hidden="true" className="opacity-50">
                  →
                </span>
              ) : null}
            </span>
          ))}
          <span aria-hidden="true" className="text-xl opacity-50">
            ↺
          </span>
        </div>
        <p
          className={`${proseClasses} mt-6`}
          dangerouslySetInnerHTML={{ __html: discovery.hcdBody }}
        />
        <CardGrid items={discovery.hcdPrinciples} columns={4} fg={fg} />
      </div>

      {/* HOW IT WORKS */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className={sectionLabelClasses}>How It Works</h2>
        <p className={leadClasses}>
          Three phases, with prototypes tested along the way.
        </p>
        <div
          className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 border-t-2 sm:grid-cols-3"
          style={{ borderColor: fg }}
        >
          {discovery.howItWorks.map((phase) => (
            <div key={phase.phase} className="flex flex-col gap-3 pt-6">
              <span
                className="w-fit rounded-[2px] px-2 py-1 text-xs font-bold tracking-[0.08em] uppercase"
                style={{ background: fg, color: bg }}
              >
                {phase.phase}
              </span>
              <h3 className="text-xl font-bold tracking-[-0.01em]">
                {phase.title}
              </h3>
              <p className="text-base leading-[1.55] opacity-80">
                {phase.body}
              </p>
              <ul className="mt-1 flex flex-col gap-1.5 text-[15px] leading-[1.5] opacity-85">
                {phase.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-[6px] w-[6px] flex-none rounded-full"
                      style={{ background: fg }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-8 grid grid-cols-1 gap-6 rounded-[4px] p-6 sm:grid-cols-3"
          style={{ background: fg, color: bg }}
        >
          <div className="sm:col-span-3">
            <span className="text-xs font-bold tracking-[0.08em] uppercase opacity-70">
              What we&rsquo;ll ask of you
            </span>
          </div>
          {discovery.askOfYou.map((item) => (
            <div key={item.title}>
              <h4 className="font-bold">{item.title}</h4>
              <p className="mt-1 text-[15px] leading-[1.45] opacity-90">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY THIS MATTERS BEFORE YOU BUILD */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className={sectionLabelClasses}>
          Why This Matters Before You Build
        </h2>
        <p
          className={leadClasses}
          dangerouslySetInnerHTML={{ __html: discovery.whyMattersLead }}
        />
        {discovery.bodyHtml2b ? (
          <div className="mt-3">
            <Prose html={discovery.bodyHtml2b} color={fg} className={proseClasses} />
          </div>
        ) : null}
      </div>

      {discovery.quote ? (
        <Quote html={discovery.quote} color={fg} align="left" />
      ) : null}

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pb-10 sm:pb-14">
        {discovery.bodyHtml2c ? (
          <Prose html={discovery.bodyHtml2c} color={fg} className={proseClasses} />
        ) : null}
        <div
          className="mt-8 max-w-[44em] rounded-[4px] p-6"
          style={{ background: fg, color: bg }}
        >
          <div className="text-xs font-bold tracking-[0.08em] uppercase opacity-70">
            The procurement case
          </div>
          <p
            className="mt-2 text-[16px] leading-[1.6]"
            dangerouslySetInnerHTML={{ __html: discovery.procurementCallout }}
          />
        </div>
      </div>

      {/* WHY WE PROTOTYPE */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className={sectionLabelClasses}>Why We Prototype</h2>
        <p
          className={leadClasses}
          dangerouslySetInnerHTML={{ __html: discovery.prototypeLead }}
        />
        <CardGrid items={discovery.principles} columns={3} fg={fg} />
      </div>

      {discovery.bodyHtml3 ? (
        <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
          <Prose html={discovery.bodyHtml3} color={fg} className={proseClasses} />
        </div>
      ) : null}

      {/* WHAT YOU GET */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className={sectionLabelClasses}>What You Get</h2>
        <p
          className={leadClasses}
          dangerouslySetInnerHTML={{ __html: discovery.whatYouGetLead }}
        />
        <div
          className="mt-8 grid grid-cols-1 border-t border-[var(--rule)] sm:grid-cols-2"
          style={{ "--rule": `${fg}1f` } as CSSProperties}
        >
          {discovery.whatYouGet.map((item, index) => (
            <div
              key={item}
              className="flex gap-4 border-b border-[var(--rule)] py-5 sm:odd:pr-8 sm:even:border-l sm:even:pl-8"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold"
                style={{ background: fg, color: bg }}
              >
                {index + 1}
              </span>
              <p
                className="text-base leading-normal"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </div>
          ))}
        </div>
      </div>


      {/* RECENT PROJECTS */}
      <RecentProjects projects={discovery.examples} bg={bg} fg={fg} />

      {/* WHO'S BEHIND THIS + SOURCES */}
      {discovery.bodyHtml3b ? (
        <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14">
          <Prose html={discovery.bodyHtml3b} color={fg} className={proseClasses} />
        </div>
      ) : null}

      {/* ONE CTA */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-16 text-center sm:py-20"
        style={{ background: fg, color: bg }}
        id="contact"
      >
        <p
          className="mx-auto max-w-[20em] text-[28px] leading-[1.15] font-bold tracking-[-0.02em] sm:text-[38px]"
          dangerouslySetInnerHTML={{ __html: discovery.closingHeading }}
        />
        <p
          className="mx-auto mt-4 max-w-[34em] text-lg leading-[1.5] opacity-80"
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
          <Link
            href={discovery.ctaSecondary.href}
            className="rounded-[2px] px-5 py-3 text-sm font-semibold hover:opacity-80"
            style={{ border: `1.5px solid ${bg}` }}
          >
            {discovery.ctaSecondary.text}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
