"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { RotatedCircleSlideshow } from "@/components/RotatedCircleSlideshow";
import { useTheme } from "@/components/ThemeProvider";
import {
  SCALE_WORDS,
  describeChangesParts,
  effectsToChanges,
} from "@/lib/trust/describe";
import { SITE_URL } from "@/content/site";
import { SCENARIOS } from "@/lib/trust/scenarios";
import {
  primaryScale,
  type Resilience,
  type TrustAction,
  type TrustType,
} from "@/lib/trust/model";

export const TYPE_INFO: Record<
  TrustType,
  { name: string; question: string; color: string }
> = {
  rational: {
    name: "Rational",
    question: "Do they do what they say?",
    color: "#3b7de8",
  },
  affinitive: {
    name: "Affinitive",
    question: "Do we know each other and share values?",
    color: "#e0702f",
  },
  systems: {
    name: "Systems-based",
    question: "Do I trust the rules and the process?",
    color: "#2fa874",
  },
};

export const DISTRUST_COLOR = "#d6453d";

export const KIND_COLOR = {
  build: "#2fa874",
  damage: DISTRUST_COLOR,
  shock: "#c58a12",
};

export const KIND_LABEL = {
  build: "Builds trust",
  damage: "Damages trust",
  shock: "Shock",
};

export const RESILIENCE_COPY: Record<
  Resilience,
  { label: string; note: string }
> = {
  none: {
    label: "No trust yet",
    note: "Nothing here is holding yet.",
  },
  fragile: {
    label: "Fragile",
    note: "One type of trust is doing all the work. Losing it loses the relationship.",
  },
  uneven: {
    label: "Uneven",
    note: "Two types are present, or the balance is lopsided. Some shocks would still get through.",
  },
  resilient: {
    label: "Resilient",
    note: "All three types are present and balanced, so each can cover for the others.",
  },
  complacent: {
    label: "Very high everywhere",
    note: "Past a point, total trust can make people stop checking and stop pushing back.",
  },
};

interface KindOfTrust {
  name: string;
  color?: string;
  what: string;
  builds?: string;
  breaks?: string;
  note?: string;
}

const KINDS: KindOfTrust[] = [
  {
    name: "Dispositional",
    what: "Where each of us starts. Some people give trust easily and some wait to be convinced.",
    note: "It moves slowly, so the other three do most of the work.",
  },
  {
    name: "Rational",
    color: TYPE_INFO.rational.color,
    what: "Trust from doing what you said. People watch whether you deliver, again and again.",
    builds: "Kept commitments, work on time, a visible record.",
    breaks: "Missed deadlines, promises with no follow-through.",
  },
  {
    name: "Affinitive",
    color: TYPE_INFO.affinitive.color,
    what: "Trust from knowing each other. It grows through contact, listening and shared experience.",
    builds: "Time together, being listened to, working side by side.",
    breaks: "Turnover, a broken confidence, being asked and never answered.",
  },
  {
    name: "Systems-based",
    color: TYPE_INFO.systems.color,
    what: "Trust in rules people can see. Fair, open procedures shaped with the people they affect.",
    builds: "Rules written together, decisions made in the open.",
    breaks:
      "Decisions made without those affected, rules that change without notice.",
  },
];

/**
 * Spreads the damaging cards evenly among the building ones, instead of all
 * the builds first. The order is fixed, so the page renders the same on the
 * server and in the browser.
 */
function mixKinds(actions: TrustAction[]): TrustAction[] {
  const builds = actions.filter((a) => a.kind === "build");
  const others = actions.filter((a) => a.kind !== "build");
  const mixed: TrustAction[] = [];
  let b = 0;
  let o = 0;
  for (let i = 0; i < actions.length; i++) {
    const wantOther =
      o < others.length &&
      Math.floor(((i + 1) * others.length) / actions.length) > o;
    mixed.push(wantOther || b >= builds.length ? others[o++] : builds[b++]);
  }
  return mixed;
}

const SHARE_TITLE = "How resilient is your team when a key person leaves?";

/**
 * Opens the phone's share sheet where there is one. Elsewhere it copies the
 * link and says so. It always shares the live address, never the one in the
 * address bar, so a preview or local copy does not get shared by mistake.
 */
function ShareButton({ fg }: { fg: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${SITE_URL}/trust`;
    try {
      if (navigator.share) {
        await navigator.share({ title: SHARE_TITLE, url });
        return;
      }
    } catch (error) {
      // Closing the share sheet is not an error worth reporting.
      if ((error as Error).name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // No clipboard access: nothing useful to do.
    }
  }

  return (
    <button
      onClick={share}
      className="cursor-pointer rounded-full px-6 py-3 text-base font-bold"
      style={{ border: `1.5px solid ${fg}` }}
    >
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}

interface TrustExplainerViewProps {
  /** The page's light-mode colors. Dark mode swaps them. */
  palette: { bg: string; fg: string };
}

export function TrustExplainerView({ palette }: TrustExplainerViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? palette.fg : palette.bg;
  const fg = isDark ? palette.bg : palette.fg;

  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const playButton = (
    <Link
      href="/trust/play"
      className="inline-block rounded-full px-6 py-3 text-base font-bold"
      style={{ background: fg, color: bg }}
    >
      Play the card game →
    </Link>
  );

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      {/* Why we are talking about this. The photo uses the homepage's image
          component and layout: on top on a phone, a full-height column on
          the right from tablet up. */}
      <div className="relative isolate w-full md:flex md:min-h-screen md:flex-col">
        <RotatedCircleSlideshow
          images={["/images/fountain.jpg"]}
          position="top"
          fit="container"
          className="-z-10 h-[360px] w-full md:absolute md:top-0 md:right-0 md:bottom-0 md:h-auto md:w-3/8"
        />

        <div className="h-6 w-full md:h-[78px]" />

        <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-12 md:flex md:w-5/8 md:flex-1 md:flex-col md:justify-center md:pt-8 md:pb-16">
          <p className="max-w-[20em] text-[32px] leading-[1.1] font-medium tracking-[-0.02em] sm:text-[52px]">
            How resilient is your team when a key person leaves?
          </p>
          <p className="mt-4 max-w-[30em] text-[20px] leading-[1.35] opacity-75 sm:text-[26px]">
            Which kinds of trust are strong in your organization, and which are
            missing?
          </p>
          <div className="mt-6 max-w-[38em] text-[18px] leading-[1.55] opacity-90 sm:text-[21px]">
            <p>
              Our work is about building the coordination that makes teams,
              organizations, and systems adaptable as circumstances change.
              People leave, funding ends and leadership changes. What matters is
              whether the work holds up when that happens, and how effectively
              the team can adapt.
            </p>
            <p className="mt-4">
              We use the{" "}
              <a
                href="https://doi.org/10.5751/ES-07248-200214"
                style={{
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                trust ecology framework
              </a>
              , from researchers Marc Stern and Timothy Baird, early in a
              project to see where a group stands, and to decide what to build:
              a shared process, a regular meeting, a record of kept promises. So
              we developed a card game to quickly illustrate how trust works.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {playButton}
            <ShareButton fg={fg} />
          </div>
        </div>
      </div>

      {/* Four kinds */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className="text-center font-serif text-[clamp(36px,5vw,64px)] leading-[1.05] font-normal tracking-[-0.025em]">
          There are four kinds of trust
        </h2>
        <p className="mx-auto mt-5 max-w-[34em] text-center text-[18px] leading-[1.55] opacity-90 sm:text-[20px]">
          Trust that rests on several kinds at once can lose one and keep
          working. Trust that rests on one kind cannot. That is why we look for
          what is missing as much as what is strong.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {KINDS.map((kind) => (
            <div key={kind.name} className="flex flex-col gap-3">
              <span
                className="h-1.5 w-10 rounded-full"
                style={{ background: kind.color ?? `${fg}59` }}
              />
              <h3 className="text-xl font-bold tracking-[-0.01em]">
                {kind.name}
              </h3>
              <p className="text-[16px] leading-[1.5] opacity-85">
                {kind.what}
              </p>
              {kind.builds && (
                <p className="text-[15px] leading-[1.45] opacity-80">
                  <span className="font-bold">Builds: </span>
                  {kind.builds}
                </p>
              )}
              {kind.breaks && (
                <p className="text-[15px] leading-[1.45] opacity-80">
                  <span className="font-bold">Breaks: </span>
                  {kind.breaks}
                </p>
              )}
              {kind.note && (
                <p className="text-[15px] leading-[1.45] opacity-80">
                  {kind.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Situations and their actions */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <h2 className="text-center font-serif text-[clamp(36px,5vw,64px)] leading-[1.05] font-normal tracking-[-0.025em]">
          How trust holds up under change
        </h2>
        <p className="mx-auto mt-5 max-w-[34em] text-center text-[18px] leading-[1.55] opacity-90 sm:text-[20px]">
          Choose a scenario to see what actions build trust and what breaks it.
        </p>
        <div
          role="tablist"
          aria-label="Situations"
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          {SCENARIOS.map((s, i) => {
            const active = s.id === scenario.id;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={active}
                onClick={() => setScenarioId(s.id)}
                className="flex-1 cursor-pointer rounded-lg px-4 py-4 text-left"
                style={{
                  border: `1.5px solid ${active ? fg : `${fg}33`}`,
                  background: active ? fg : "transparent",
                  color: active ? bg : fg,
                }}
              >
                <span className="text-sm font-bold tabular-nums opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-lg font-bold tracking-[-0.01em]">
                  {s.name}
                </span>
                <span className="mt-1 block text-[14px] leading-[1.4] opacity-80">
                  {s.tagline}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-[44em] flex-col gap-6 text-[17px] leading-[1.55] opacity-90">
          <p>
            <span className="font-bold">Scenario:</span> {scenario.setting}
          </p>
          <p>
            <span className="font-bold">At stake:</span> {scenario.atStake}
          </p>
        </div>

        <h3 className="mt-12 text-lg font-bold tracking-[-0.01em]">
          What people do
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mixKinds(scenario.actions).map((action) => (
            <ActionCard key={action.id} action={action} fg={fg} />
          ))}
        </div>

        <h3 className="mt-12 text-lg font-bold tracking-[-0.01em]">
          What can land on you
        </h3>
        <p className="mt-1 max-w-[38em] text-[15px] leading-[1.5] opacity-75">
          Shocks hit one kind of trust hard. How much they do depends on what
          else is holding.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {scenario.shocks.map((action) => (
            <ActionCard key={action.id} action={action} fg={fg} />
          ))}
        </div>
      </div>

      {/* Close */}
      <div
        className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
        style={{ borderTop: `1px solid ${fg}1f` }}
      >
        <p className="max-w-[24em] text-[24px] leading-[1.2] font-medium tracking-[-0.01em] sm:text-[32px]">
          Draw the cards and watch what happens to trust.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {playButton}
          <ShareButton fg={fg} />
        </div>
        <p className="mt-10 max-w-[44em] text-[13px] leading-[1.5] opacity-60">
          Prototype. The situations are composites written to show how the
          framework behaves, and the numbers are illustrative. The framework is
          from Marc J. Stern and Timothy D. Baird,{" "}
          <a
            href="https://doi.org/10.5751/ES-07248-200214"
            style={{
              textDecoration: "underline dotted",
              textUnderlineOffset: "3px",
            }}
          >
            Trust ecology and the resilience of natural resource management
            institutions
          </a>
          , Ecology and Society 20(2), 2015.
        </p>
      </div>

      <Footer />
    </div>
  );
}

interface ActionCardProps {
  action: TrustAction;
  fg: string;
}

function ActionCard({ action, fg }: ActionCardProps) {
  const accent = KIND_COLOR[action.kind];
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl"
      style={{
        border: `1.5px solid ${action.kind === "shock" ? accent : `${fg}33`}`,
      }}
    >
      <div className="flex-1 p-5 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.06em] uppercase"
            style={{ background: accent, color: "#fff" }}
          >
            {KIND_LABEL[action.kind]}
          </span>
          <span className="text-[11px] font-bold tracking-[0.06em] uppercase opacity-60">
            Mostly {SCALE_WORDS[primaryScale(action)]}
          </span>
        </div>
        <h4 className="mt-3 text-[18px] leading-[1.2] font-bold tracking-[-0.01em]">
          {action.label}
        </h4>
        <p className="mt-2 text-[15px] leading-[1.45] opacity-80">
          {action.summary}
        </p>
      </div>
      {/* What the card does to trust, in a slightly darker band that sits at
          the bottom of every card in a row, whatever the text above runs to. */}
      <div
        className="px-5 py-4 text-[15px] leading-[1.45]"
        style={{ background: `${fg}0f` }}
      >
        {describeChangesParts(effectsToChanges(action.effects)).map(
          (part, i) =>
            part.strong ? (
              <span key={i} className="font-semibold">
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            )
        )}
      </div>
    </div>
  );
}
