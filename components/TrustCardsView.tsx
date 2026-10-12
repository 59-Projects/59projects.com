"use client";

import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import {
  DISTRUST_COLOR,
  KIND_COLOR,
  KIND_LABEL,
  RESILIENCE_COPY,
  TYPE_INFO,
} from "@/components/TrustExplainerView";
import { SCALE_WORDS, describeChanges } from "@/lib/trust/describe";
import { SCENARIOS } from "@/lib/trust/scenarios";
import {
  SCALES,
  TYPES,
  applyAction,
  assess,
  buildDeck,
  primaryScale,
  weightBearing,
  type Buffered,
  type Change,
  type Grid,
  type Scale,
  type Scenario,
  type TrustAction,
  type TrustType,
} from "@/lib/trust/model";

interface Turn {
  action: TrustAction;
  /** Trust as it stood before this card, so it can be undone. */
  before: Grid;
  changes: Change[];
  buffered: Buffered[];
}

const SWIPE_THRESHOLD = 90;
const FLING_MS = 220;

/**
 * Every card is a square. Width is capped by the
 * space left under the nav and above the scores, so on a short screen the card
 * gets smaller instead of running under the scores. The rows of buttons and
 * labels use the same width so everything lines up with the card.
 */
const CARD_W = "min(100%, 26em, max(16em, calc(100svh - 24rem)))";

const sectionLabelClasses =
  "text-sm font-semibold tracking-[0.06em] uppercase opacity-55";

const SCALE_SHORT: Record<Scale, string> = {
  person: "Person",
  org: "Org",
  system: "System",
};

function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface TrustCardsViewProps {
  palette: { bg: string; fg: string };
}

type Phase = "rules" | "pick" | "shuffle" | "setting" | "play" | "debrief";

export function TrustCardsView({ palette }: TrustCardsViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? palette.fg : palette.bg;
  const fg = isDark ? palette.bg : palette.fg;

  const [phase, setPhase] = useState<Phase>("rules");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [deck, setDeck] = useState<TrustAction[]>([]);
  const [index, setIndex] = useState(0);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? null;
  const card = deck[index];
  // The card on the table is the last one drawn, and its effect is already in.
  const current = turns[turns.length - 1];

  const start = useCallback((id: string) => {
    const next = SCENARIOS.find((s) => s.id === id);
    if (!next) return;
    setScenarioId(id);
    setDeck(buildDeck(next));
    setIndex(0);
    setGrid(next.start);
    setTurns([]);
    setPhase("shuffle");
  }, []);

  /** Draw the first card. Its effect lands as it appears. */
  const begin = useCallback(() => {
    if (!scenario || deck.length === 0) return;
    const step = applyAction(scenario.start, scenario, deck[0]);
    setGrid(step.grid);
    setIndex(0);
    setTurns([
      {
        action: deck[0],
        before: scenario.start,
        changes: step.changes,
        buffered: step.buffered,
      },
    ]);
    setPhase("play");
  }, [scenario, deck]);

  /** Move to the next card in the deck, or to the results after the last. */
  const advance = useCallback(() => {
    if (!scenario || !grid) return;
    const next = deck[index + 1];
    if (!next) {
      setPhase("debrief");
      return;
    }
    const step = applyAction(grid, scenario, next);
    setGrid(step.grid);
    setTurns((prev) => [
      ...prev,
      {
        action: next,
        before: grid,
        changes: step.changes,
        buffered: step.buffered,
      },
    ]);
    setIndex((i) => i + 1);
  }, [scenario, grid, deck, index]);

  const undo = useCallback(() => {
    if (turns.length < 2) return;
    setGrid(turns[turns.length - 1].before);
    setTurns((prev) => prev.slice(0, -1));
    setIndex((i) => i - 1);
  }, [turns]);

  const toSetting = useCallback(() => setPhase("setting"), []);
  const toPick = useCallback(() => setPhase("pick"), []);

  return (
    <div
      className="relative isolate flex min-h-screen w-full flex-col"
      style={{ background: bg, color: fg }}
    >
      {/* On desktop the right column (the explanation and the scores) sits on
          a slightly darker band that runs the full height of the page, from
          the top edge to the bottom. */}
      {phase === "play" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[34em] lg:block"
          style={{ background: `${fg}0f` }}
        />
      )}
      <div className="h-[78px] w-full flex-none" />
      {phase !== "play" && (
        <div className="px-5 pt-3 pb-3">
          <Link
            href="/trust"
            className="inline-block rounded-full px-5 py-2.5 text-[16px] font-bold"
            style={{ border: `1.5px solid ${fg}` }}
          >
            ← Back to the explainer
          </Link>
        </div>
      )}

      {phase === "rules" && <Rules onDone={toPick} fg={fg} bg={bg} />}
      {phase === "pick" && <Picker onPick={start} fg={fg} bg={bg} />}
      {phase === "shuffle" && <Shuffle onDone={toSetting} fg={fg} bg={bg} />}
      {phase === "setting" && scenario && (
        <Setting scenario={scenario} onStart={begin} fg={fg} bg={bg} />
      )}
      {phase === "play" && scenario && grid && card && current && (
        <Table
          scenario={scenario}
          grid={grid}
          card={card}
          cardNumber={index + 1}
          total={deck.length}
          next={deck[index + 1]}
          turn={current}
          turnKey={turns.length}
          onAdvance={advance}
          onUndo={undo}
          onQuit={toPick}
          fg={fg}
          bg={bg}
        />
      )}
      {phase === "debrief" && scenario && grid && (
        <Debrief
          scenario={scenario}
          grid={grid}
          turns={turns}
          onAgain={() => start(scenario.id)}
          onOther={toPick}
          fg={fg}
          bg={bg}
        />
      )}

      {(phase === "pick" || phase === "debrief") && <Footer />}
    </div>
  );
}

/* ---------------------------------------------------------------- Rules */

interface Rule {
  title: string;
  /** What the idea means. */
  body?: string;
  /** What it means for playing the game, shown as its own paragraph. */
  game?: string;
  color?: string;
}

const RULES: Rule[] = [
  {
    title: "There are four kinds of trust.",
    body: "Each one comes from something different, and each can fail on its own.",
    game: "Let's meet all four types in play.",
  },
  {
    title: "Dispositional trust is where each of us starts.",
    body: "Before anyone does anything, you already lean one way. Some people give trust easily and some wait to be convinced. It comes from history and temperament, so it is slow to change.",
    game: "In the game, it changes how much credit a good move earns. No starting point is better than another.",
  },
  {
    title: "Rational trust comes from doing what you said.",
    body: "People watch whether you deliver, on time, again and again. It is built on a record, one kept promise at a time. A missed deadline lands in it right away.",
    game: "In the game, it rises when you deliver and falls when you miss.",
    color: TYPE_INFO.rational.color,
  },
  {
    title: "Affinitive trust comes from knowing each other.",
    body: "Contact, listening and shared experience. It grows quickly and often rests on a few people. When one of them leaves, it can leave with them.",
    game: "In the game, it rises with time spent together and falls when key people go.",
    color: TYPE_INFO.affinitive.color,
  },
  {
    title: "Systems-based trust comes from rules people can see.",
    body: "Procedures that are fair, open and shaped with the people they affect. They keep working when individuals change. Hiding how decisions get made wears them down.",
    game: "In the game, it rises when people help write the rules and falls when decisions are made without them.",
    color: TYPE_INFO.systems.color,
  },
  {
    title: "Trust lives at three scales.",
    body: "Between people, inside an organization, and in the system around them. You can trust someone and still not trust their institution.",
  },
  {
    title: "Draw a card. See what it does.",
    game: "Each card is something that happens, good or bad. Read what it did to trust, then swipe or tap to the next one. Now and then a shock lands, and the trust you built decides how hard.",
  },
];

interface RulesProps {
  onDone: () => void;
  fg: string;
  bg: string;
}

function Rules({ onDone, fg, bg }: RulesProps) {
  const [i, setI] = useState(0);
  const rule = RULES[i];
  const isLast = i === RULES.length - 1;
  const advance = useCallback(() => {
    if (isLast) onDone();
    else setI((n) => n + 1);
  }, [isLast, onDone]);
  const back = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  return (
    <div className="flex w-full flex-1 flex-col items-center px-[clamp(20px,2.5vw,40px)] pt-6 pb-12">
      <div
        style={{ width: CARD_W }}
        className="flex items-center justify-between pb-3 text-[13px]"
      >
        <span className="font-semibold tracking-[0.06em] uppercase opacity-55">
          How it works
        </span>
        <span className="tabular-nums opacity-60">
          {i + 1} of {RULES.length}
        </span>
      </div>
      <Swipeable
        key={i}
        onSwipe={advance}
        hasNext={!isLast}
        borderColor={rule.color ?? `${fg}66`}
        fg={fg}
        bg={bg}
      >
        <div>
          {rule.color && (
            <span
              className="block h-1.5 w-10 rounded-full"
              style={{ background: rule.color }}
            />
          )}
          <h2 className="mt-4 text-[clamp(22px,8cqw,36px)] leading-[1.1] font-bold tracking-[-0.02em]">
            {rule.title}
          </h2>
          {rule.body && (
            <p className="mt-[3cqw] text-[clamp(15px,5cqw,21px)] leading-[1.38] opacity-80">
              {rule.body}
            </p>
          )}
        </div>
        {rule.game && (
          <p className="mt-4 text-[clamp(15px,5cqw,21px)] leading-[1.38] opacity-80">
            {rule.game}
          </p>
        )}
      </Swipeable>

      <div
        style={{ width: CARD_W }}
        className="mt-5 flex flex-col items-center gap-3"
      >
        <div className="flex w-full gap-3">
          {i > 0 && (
            <button
              onClick={back}
              className="flex-1 cursor-pointer rounded-full py-3 text-base font-bold"
              style={{ border: `1.5px solid ${fg}66` }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={advance}
            className="flex-[2] cursor-pointer rounded-full py-3 text-base font-bold"
            style={{ background: fg, color: bg }}
          >
            {isLast ? "Pick a situation" : "Next →"}
          </button>
        </div>
        {!isLast && (
          <button
            onClick={onDone}
            className="cursor-pointer text-sm font-semibold underline decoration-dotted underline-offset-[3px] opacity-60"
          >
            Skip the rules
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Picker */

interface PickerProps {
  onPick: (id: string) => void;
  fg: string;
  bg: string;
}

function Picker({ onPick, fg, bg }: PickerProps) {
  return (
    <div className="w-full flex-1 px-[clamp(20px,2.5vw,40px)] pt-4 pb-14 sm:pt-10">
      <p className="max-w-[30em] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] sm:text-[42px] sm:leading-[1.1]">
        Pick a situation.
      </p>
      <p className="mt-3 max-w-[36em] text-lg leading-[1.4] opacity-75 sm:text-xl">
        The same four kinds of trust behave differently in each one.
      </p>

      <div className="mt-8 flex max-w-[60em] flex-col gap-3">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onPick(s.id)}
            className="cursor-pointer rounded-lg px-4 py-4 text-left"
            style={{ background: bg, border: `1.5px solid ${fg}33` }}
          >
            <span className="text-sm font-bold tabular-nums opacity-60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-lg font-bold tracking-[-0.01em]">
              {s.name}
            </span>
            <span className="mt-1 block text-[14px] leading-[1.4] opacity-75">
              {s.tagline}
            </span>
            <span
              className="mt-3 inline-block rounded-full px-3 py-1 text-[13px] font-bold"
              style={{ background: fg, color: bg }}
            >
              Shuffle the deck
            </span>
          </button>
        ))}
      </div>

      <p className="mt-10 max-w-[40em] text-sm leading-[1.5] opacity-60">
        Prototype. The scenarios are composites and the numbers are
        illustrative. The framework is from{" "}
        <a
          href="https://doi.org/10.5751/ES-07248-200214"
          style={{
            textDecoration: "underline dotted",
            textUnderlineOffset: "3px",
          }}
        >
          Stern and Baird (2015)
        </a>
        .
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- Shuffle */

interface ShuffleProps {
  onDone: () => void;
  fg: string;
  bg: string;
}

const SHUFFLE_CARDS = 7;
const SHUFFLE_STEP_MS = 380;
const SHUFFLE_STEPS = 4;

function Shuffle({ onDone, fg, bg }: ShuffleProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = window.setTimeout(onDone, 500);
      return () => window.clearTimeout(t);
    }
    const timers: number[] = [];
    for (let n = 1; n <= SHUFFLE_STEPS; n++) {
      timers.push(window.setTimeout(() => setStep(n), n * SHUFFLE_STEP_MS));
    }
    timers.push(
      window.setTimeout(onDone, (SHUFFLE_STEPS + 1) * SHUFFLE_STEP_MS + 200)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onDone]);

  const settled = step >= SHUFFLE_STEPS;

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-[clamp(20px,2.5vw,40px)] pb-20">
      <div className="relative h-[15em] w-[11em]" aria-hidden="true">
        {Array.from({ length: SHUFFLE_CARDS }, (_, k) => {
          const x = settled ? 0 : ((k * 37 + step * 61) % 120) - 60;
          const y = settled ? -k * 2 : ((k * 23 + step * 41) % 40) - 20;
          const r = settled ? 0 : ((k * 53 + step * 29) % 50) - 25;
          return (
            <div
              key={k}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: bg,
                border: `2px solid ${fg}66`,
                boxShadow: `0 4px 12px ${fg}1f`,
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                transition: `transform ${SHUFFLE_STEP_MS - 40}ms ease-in-out`,
              }}
            />
          );
        })}
      </div>
      <p
        aria-live="polite"
        className="mt-10 text-sm font-semibold tracking-[0.06em] uppercase opacity-60"
      >
        Shuffling the deck
      </p>
    </div>
  );
}

/* -------------------------------------------------------------- Setting */

interface SettingProps {
  scenario: Scenario;
  onStart: () => void;
  fg: string;
  bg: string;
}

function Setting({ scenario, onStart, fg, bg }: SettingProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center px-[clamp(20px,2.5vw,40px)] pt-6 pb-12">
      <div
        style={{ width: CARD_W }}
        className="pb-3 text-[13px] font-semibold tracking-[0.06em] uppercase opacity-55"
      >
        The situation
      </div>
      <Swipeable
        onSwipe={onStart}
        hasNext
        borderColor={`${fg}66`}
        fg={fg}
        bg={bg}
      >
        <div>
          <h2 className="text-[clamp(22px,7cqw,30px)] leading-[1.12] font-bold tracking-[-0.02em]">
            {scenario.name}
          </h2>
          <p className="mt-[3cqw] text-[clamp(14px,4cqw,17px)] leading-[1.42] opacity-85">
            {scenario.setting}
          </p>
        </div>
        <p className="mt-4 text-[clamp(14px,4cqw,17px)] leading-[1.42]">
          <span className="font-bold tracking-[0.06em] uppercase opacity-60">
            At stake{" "}
          </span>
          <span className="opacity-90">{scenario.atStake}</span>
        </p>
      </Swipeable>

      <button
        onClick={onStart}
        className="mt-5 cursor-pointer rounded-full py-3 text-base font-bold"
        style={{ background: fg, color: bg, width: CARD_W }}
      >
        Deal the first card →
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------- Table */

interface TableProps {
  scenario: Scenario;
  grid: Grid;
  card: TrustAction;
  next?: TrustAction;
  cardNumber: number;
  total: number;
  /** The card on the table, with what its effect did. */
  turn: Turn;
  /** Changes on every card, so animations replay. */
  turnKey: number;
  onAdvance: () => void;
  onUndo: () => void;
  onQuit: () => void;
  fg: string;
  bg: string;
}

function Table({
  scenario,
  grid,
  card,
  next,
  cardNumber,
  total,
  turn,
  turnKey,
  onAdvance,
  onUndo,
  onQuit,
  fg,
  bg,
}: TableProps) {
  const { isDark: dark } = useTheme();
  const isLast = cardNumber === total;

  return (
    <div className="flex w-full flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,34em)]">
      <div className="flex flex-col pb-6">
        {/* Top strip */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 pt-3 pb-3">
          <Link
            href="/trust"
            className="inline-block rounded-full px-5 py-2.5 text-[16px] font-bold"
            style={{ border: `1.5px solid ${fg}` }}
          >
            ← Back to the explainer
          </Link>
          <button
            onClick={onQuit}
            className="cursor-pointer text-[16px] font-semibold underline decoration-dotted underline-offset-[3px] opacity-80"
          >
            {scenario.name}
          </button>
          <span className="ml-auto flex items-center gap-4 text-[14px]">
            {cardNumber > 1 && (
              <button
                onClick={onUndo}
                className="cursor-pointer font-semibold underline decoration-dotted underline-offset-[3px] opacity-80"
              >
                ← Back a card
              </button>
            )}
            <span className="tabular-nums opacity-60">
              {cardNumber} of {total}
            </span>
          </span>
        </div>
        <div
          className="mx-5 h-[3px] rounded-full"
          style={{ background: `${fg}1f` }}
        >
          <div
            className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300"
            style={{
              width: `${(cardNumber / total) * 100}%`,
              background: fg,
            }}
          />
        </div>

        <div className="flex flex-col items-center px-[clamp(20px,2.5vw,40px)] pt-5">
          <SwipeCard
            key={`${cardNumber}-${card.id}`}
            card={card}
            hasNext={Boolean(next)}
            onAdvance={onAdvance}
            fg={fg}
            bg={bg}
          />

          {/* What this card did, directly below it */}
          <div
            aria-live="polite"
            style={{ width: CARD_W }}
            className="mt-6 min-h-[8em] lg:hidden"
          >
            <Explainer key={turnKey} turn={turn} scales={scenario.scales} />
          </div>

          <button
            onClick={onAdvance}
            style={{ background: fg, color: bg, width: CARD_W }}
            className="mt-4 cursor-pointer rounded-full py-3 text-base font-bold"
            aria-keyshortcuts="ArrowRight"
          >
            {isLast ? "See where trust ended up →" : "Next card →"}
          </button>
        </div>
      </div>

      {/* The scores. Pinned to the bottom on a phone, a column on the right
          on desktop. */}
      <div
        className="sticky bottom-0 w-full border-t px-[clamp(16px,2.5vw,40px)] pt-4 pb-4 lg:top-[90px] lg:bottom-auto lg:self-start lg:border-t-0 lg:bg-transparent! lg:pt-10 lg:pb-8"
        style={{ background: bg, borderColor: `${fg}1f` }}
      >
        <div className="mx-auto max-w-[44em]">
          {/* On desktop the explainer sits here, above the scores it moved */}
          <div aria-live="polite" className="mb-8 hidden min-h-[11em] lg:block">
            <Explainer key={turnKey} turn={turn} scales={scenario.scales} />
          </div>
          <Meters
            scales={scenario.scales}
            bg={bg}
            grid={grid}
            changes={turn.changes}
            turnKey={turnKey}
            dark={dark}
            fg={fg}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Meters */

type InfoKey =
  | { kind: "all" }
  | { kind: "type"; type: TrustType }
  | { kind: "scale"; scale: Scale };

/** Short reminders of each kind of trust, shown from the bars' labels. */
const TYPE_DEFINITIONS: {
  name: string;
  color?: string;
  text: string;
  type?: TrustType;
}[] = [
  {
    name: "Dispositional",
    text: "Where each of us starts. Some people give trust easily and some wait to be convinced. It is slow to change, and it sets how much credit a good move earns.",
  },
  {
    name: "Rational",
    type: "rational",
    color: TYPE_INFO.rational.color,
    text: "Trust from doing what you said. People watch whether you deliver, again and again.",
  },
  {
    name: "Affinitive",
    type: "affinitive",
    color: TYPE_INFO.affinitive.color,
    text: "Trust from knowing each other. Contact, listening and shared experience, often resting on a few people.",
  },
  {
    name: "Systems-based",
    type: "systems",
    color: TYPE_INFO.systems.color,
    text: "Trust in rules people can see. Fair, open procedures shaped with the people they affect.",
  },
];

const SCALE_DEFINITIONS: Record<Scale, string> = {
  person: "Trust between individual people.",
  org: "Trust inside an organization, and between organizations.",
  system: "Trust in the rules and structure around everyone.",
};

interface MetersProps {
  scales: Record<Scale, { label: string; who: string }>;
  bg: string;
  grid: Grid;
  changes: Change[];
  turnKey: number;
  dark: boolean;
  fg: string;
}

/**
 * Rows are scales, columns are trust types, so each bar is wide enough on a
 * phone to show what just moved: a striped segment for trust gained, a dashed
 * outline where trust was lost, and a signed number above the bar. Labels are
 * buttons that open a short reminder of what they mean.
 */
function Meters({ scales, bg, grid, changes, turnKey, dark, fg }: MetersProps) {
  const [info, setInfo] = useState<InfoKey | null>(null);
  const [expanded, setExpanded] = useState(false);

  // One row for everything: the average across the three scales, and how much
  // that average moved. Opposite moves at different scales can cancel here,
  // which is what the breakdown is for.
  const overall = TYPES.map((type) => {
    const value =
      SCALES.reduce((sum, scale) => sum + grid[scale][type], 0) / SCALES.length;
    const moved = changes
      .filter((c) => c.type === type)
      .reduce((sum, c) => sum + c.delta, 0);
    const delta = Math.round(moved / SCALES.length);
    return { type, value, change: delta === 0 ? undefined : { delta } };
  });

  useEffect(() => {
    if (!info) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setInfo(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [info]);

  function toggle(next: InfoKey) {
    setInfo((cur) =>
      cur && JSON.stringify(cur) === JSON.stringify(next) ? null : next
    );
  }
  const labelButton =
    "text-left underline decoration-dotted underline-offset-[3px] hover:opacity-100";

  return (
    <div className="relative">
      {info && (
        <div
          role="region"
          aria-label="Reminder"
          className="absolute right-0 bottom-full left-0 z-20 mb-3 rounded-xl p-4 text-[15px] leading-[1.45]"
          style={{
            background: bg,
            border: `1.5px solid ${fg}55`,
            boxShadow: `0 10px 30px ${fg}26`,
          }}
        >
          <button
            onClick={() => setInfo(null)}
            aria-label="Close reminder"
            className="absolute top-2 right-3 cursor-pointer text-[18px] leading-none opacity-60"
          >
            ×
          </button>
          {info.kind === "scale" ? (
            <div className="pr-6">
              <p className="font-bold">{scales[info.scale].label}</p>
              <p className="mt-1 opacity-85">
                {SCALE_DEFINITIONS[info.scale]} Here:{" "}
                {scales[info.scale].who.charAt(0).toLowerCase()}
                {scales[info.scale].who.slice(1)}.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5 pr-6">
              {TYPE_DEFINITIONS.filter(
                (d) =>
                  info.kind === "all" ||
                  (info.kind === "type" && d.type === info.type)
              ).map((d) => (
                <li key={d.name}>
                  <p className="flex items-center gap-2 font-bold">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 flex-none rounded-sm"
                      style={{ background: d.color ?? `${fg}66` }}
                    />
                    {d.name}
                  </p>
                  <p className="mt-0.5 opacity-85">{d.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid grid-cols-[4.4em_repeat(3,minmax(0,1fr))] items-end gap-x-3 gap-y-2.5 sm:grid-cols-[5.4em_repeat(3,minmax(0,1fr))] sm:gap-x-5">
        <button
          onClick={() => toggle({ kind: "all" })}
          aria-expanded={info?.kind === "all"}
          className="cursor-pointer self-end pb-px text-left text-[11px] font-bold tracking-[0.04em] uppercase opacity-60 hover:opacity-100"
        >
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">
            ?
          </span>
        </button>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => toggle({ kind: "type", type })}
            aria-expanded={info?.kind === "type" && info.type === type}
            className={`flex items-center gap-1.5 text-[11px] font-bold tracking-[0.04em] uppercase opacity-80 ${labelButton} cursor-pointer`}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 flex-none rounded-sm"
              style={{ background: TYPE_INFO[type].color }}
            />
            {type === "systems" ? "Systems" : TYPE_INFO[type].name}
          </button>
        ))}
        <span className="self-end pb-px text-[12px] font-bold tracking-[0.04em] uppercase opacity-90">
          Overall
        </span>
        {overall.map(({ type, value, change }) => (
          <MeterCell
            key={type}
            label="Overall"
            type={type}
            value={value}
            change={change}
            turnKey={turnKey}
            dark={dark}
          />
        ))}
        {expanded &&
          SCALES.map((scale) => (
            <Fragment key={scale}>
              <button
                onClick={() => toggle({ kind: "scale", scale })}
                aria-expanded={info?.kind === "scale" && info.scale === scale}
                className={`self-end pb-px text-[12px] font-bold tracking-[0.04em] uppercase opacity-75 ${labelButton} cursor-pointer`}
              >
                {SCALE_SHORT[scale]}
              </button>
              {TYPES.map((type) => (
                <MeterCell
                  key={type}
                  label={SCALE_SHORT[scale]}
                  type={type}
                  value={grid[scale][type]}
                  change={changes.find(
                    (c) => c.scale === scale && c.type === type
                  )}
                  turnKey={turnKey}
                  dark={dark}
                />
              ))}
            </Fragment>
          ))}
      </div>
      <button
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="mt-3 cursor-pointer text-[13px] font-semibold underline decoration-dotted underline-offset-[3px] opacity-80 hover:opacity-100"
      >
        {expanded ? "Hide the breakdown ▴" : "Show person, org and system ▾"}
      </button>
    </div>
  );
}

interface MeterCellProps {
  label: string;
  type: TrustType;
  value: number;
  change?: { delta: number };
  turnKey: number;
  dark: boolean;
}

const STRIPES =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.75) 0 2px, transparent 2px 5px)";

function MeterCell({
  label,
  type,
  value,
  change,
  turnKey,
  dark,
}: MeterCellProps) {
  const color = TYPE_INFO[type].color;
  const positive = value >= 0;
  const before = change ? value - change.delta : value;
  const gained = change !== undefined && change.delta > 0;
  const deltaColor = gained
    ? dark
      ? "#4cc794"
      : "#177a52"
    : dark
      ? "#ff8379"
      : "#c0322a";

  return (
    <div>
      <div className="flex h-[17px] items-center justify-end">
        {change && (
          <span
            key={turnKey}
            className="trust-pop text-[14px] leading-none font-bold tabular-nums"
            style={{ color: deltaColor }}
          >
            {signed(change.delta)}
          </span>
        )}
      </div>
      <div
        role="meter"
        aria-label={`${label}, ${TYPE_INFO[type].name} trust`}
        aria-valuemin={-100}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        className="relative h-3 overflow-hidden rounded-full"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-current opacity-10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 motion-safe:transition-[width,left] motion-safe:duration-500"
          style={{
            width: `${Math.abs(value) / 2}%`,
            left: positive ? "50%" : `${50 - Math.abs(value) / 2}%`,
            background: positive ? color : DISTRUST_COLOR,
          }}
        />
        {change && (
          <div
            key={turnKey}
            aria-hidden="true"
            className="trust-ghost absolute inset-y-0"
            style={{
              left: `${50 + Math.min(before, value) / 2}%`,
              width: `${Math.abs(change.delta) / 2}%`,
              background: gained ? STRIPES : `${color}33`,
              border: gained ? "none" : `1.5px dashed ${color}`,
              boxSizing: "border-box",
            }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-px bg-current opacity-40"
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Card */

interface SwipeableProps {
  onSwipe: (direction: "left" | "right") => void;
  children: ReactNode;
  borderColor: string;
  /** Label shown while dragging toward each side, if any. */
  hint?: (direction: "left" | "right") => string;
  hasNext?: boolean;
  fg: string;
  bg: string;
}

function Swipeable({
  onSwipe,
  children,
  borderColor,
  hint,
  hasNext,
  fg,
  bg,
}: SwipeableProps) {
  const [dx, setDx] = useState(0);
  const [exit, setExit] = useState<"left" | "right" | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const decided = useRef(false);

  const commit = useCallback(
    (direction: "left" | "right") => {
      if (decided.current) return;
      decided.current = true;
      if (prefersReducedMotion()) {
        onSwipe(direction);
        return;
      }
      setExit(direction);
      window.setTimeout(() => onSwipe(direction), FLING_MS);
    },
    [onSwipe]
  );

  // Arrow keys flow through here so the card still animates away. The
  // on-screen buttons call the parent directly.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") commit("right");
      else if (event.key === "ArrowLeft") commit("left");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commit]);

  function down(event: ReactPointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    setDx(event.clientX - startX.current);
  }
  function up() {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (Math.abs(dx) > SWIPE_THRESHOLD) commit(dx > 0 ? "right" : "left");
    else setDx(0);
  }

  const offset = exit ? (exit === "right" ? 600 : -600) : dx;
  const rotate = offset / 18;
  const lean = Math.max(-1, Math.min(1, dx / SWIPE_THRESHOLD));
  const hintText = hint && lean !== 0 ? hint(lean > 0 ? "right" : "left") : "";

  return (
    <div className="relative" style={{ width: CARD_W }}>
      {hasNext && (
        <div
          aria-hidden="true"
          className="absolute inset-x-3 top-3 h-full rounded-2xl"
          style={{ background: `${fg}0f`, border: `1px solid ${fg}1f` }}
        />
      )}
      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="[container-type:inline-size] relative flex aspect-square w-full touch-pan-y flex-col justify-between overflow-y-auto rounded-2xl p-4 select-none sm:p-6"
        style={{
          background: bg,
          border: `2px solid ${borderColor}`,
          boxShadow: `0 10px 30px ${fg}1f`,
          transform: `translateX(${offset}px) rotate(${rotate}deg)`,
          opacity: exit ? 0 : 1,
          transition:
            dragging && !exit
              ? "none"
              : `transform ${FLING_MS}ms ease-out, opacity ${FLING_MS}ms ease-out`,
          cursor: "grab",
        }}
      >
        {hintText && (
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.06em] uppercase"
            style={{
              background: lean > 0 ? fg : "transparent",
              color: lean > 0 ? bg : fg,
              opacity: Math.abs(lean) * 0.9,
            }}
          >
            {hintText}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

interface SwipeCardProps {
  card: TrustAction;
  hasNext: boolean;
  onAdvance: () => void;
  fg: string;
  bg: string;
}

function SwipeCard({ card, hasNext, onAdvance, fg, bg }: SwipeCardProps) {
  const isShock = card.kind === "shock";
  const accent = KIND_COLOR[card.kind];

  return (
    <Swipeable
      onSwipe={onAdvance}
      hasNext={hasNext}
      borderColor={isShock ? accent : `${fg}66`}
      fg={fg}
      bg={bg}
    >
      <div>
        {isShock && (
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.06em] uppercase"
            style={{ background: accent, color: "#fff" }}
          >
            Shock
          </span>
        )}
        <h2
          className={`${isShock ? "mt-4" : ""} text-[clamp(22px,7.5cqw,32px)] leading-[1.12] font-bold tracking-[-0.02em]`}
        >
          {card.label}
        </h2>
        <p className="mt-[3cqw] text-[clamp(15px,4.8cqw,20px)] leading-[1.4] opacity-80">
          {card.summary}
        </p>
      </div>
    </Swipeable>
  );
}

/* ------------------------------------------------------------ Explainer */

interface ExplainerProps {
  turn: Turn;
  scales: Record<Scale, { label: string }>;
}

/** Why the card moved trust the way it did, shown under the card. */
function Explainer({ turn, scales }: ExplainerProps) {
  const { action, changes, buffered } = turn;
  const isShock = action.kind === "shock";

  return (
    <div className="trust-fade-in">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {!isShock && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.06em] uppercase"
            style={{ background: KIND_COLOR[action.kind], color: "#fff" }}
          >
            {KIND_LABEL[action.kind]}
          </span>
        )}
        <span className="text-[11px] font-bold tracking-[0.06em] uppercase opacity-60">
          Mostly {SCALE_WORDS[primaryScale(action)]}
        </span>
      </div>
      <p className="text-[clamp(16px,4.4vw,19px)] leading-[1.35] font-semibold tracking-[-0.005em] lg:text-[22px] lg:leading-[1.3]">
        {action.why}
      </p>
      {buffered.map((b) => (
        <p
          key={`${b.scale}-${b.type}`}
          className="mt-3 text-[15px] leading-[1.4] opacity-85"
        >
          {scales[b.scale].label}, {TYPE_INFO[b.type].name.toLowerCase()}: about{" "}
          {b.saved} points absorbed by{" "}
          {b.by.map((t) => TYPE_INFO[t].name.toLowerCase()).join(" and ")}{" "}
          trust.
        </p>
      ))}
      {isShock && buffered.length === 0 && (
        <p className="mt-3 text-[15px] leading-[1.4] opacity-85">
          Nothing absorbed this one. No other kind of trust was strong enough to
          cover.
        </p>
      )}
      {changes.length > 0 && (
        <p className="mt-3 text-[15px] leading-[1.4] opacity-80">
          {describeChanges(changes)}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Debrief */

interface DebriefProps {
  scenario: Scenario;
  grid: Grid;
  turns: Turn[];
  onAgain: () => void;
  onOther: () => void;
  fg: string;
  bg: string;
}

function Debrief({
  scenario,
  grid,
  turns,
  onAgain,
  onOther,
  fg,
  bg,
}: DebriefProps) {
  const shocks = turns.filter((t) => t.action.kind === "shock");
  return (
    <div className="w-full flex-1 px-[clamp(20px,2.5vw,40px)] pt-4 pb-14 sm:pt-10">
      <h2 className={sectionLabelClasses}>{scenario.name}</h2>
      <p className="mt-3 max-w-[28em] text-[28px] leading-[1.15] font-medium tracking-[-0.02em] sm:text-[38px]">
        Here is where trust ended up.
      </p>
      <div className="mt-8 grid max-w-[60em] grid-cols-1 gap-8 sm:grid-cols-3">
        {SCALES.map((scale) => {
          const read = assess(grid, scale);
          const weight = weightBearing(grid, scenario, scale);
          return (
            <section key={scale} aria-label={scenario.scales[scale].label}>
              <h3 className="text-base font-bold">
                {scenario.scales[scale].label}
              </h3>
              <p className="text-[13px] font-semibold opacity-80">
                {RESILIENCE_COPY[read.state].label}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {TYPES.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="w-[5.5em] flex-none text-[12px] font-semibold">
                      {TYPE_INFO[type].name}
                    </span>
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full">
                      <div className="absolute inset-0 bg-current opacity-10" />
                      <div
                        className="absolute inset-y-0"
                        style={{
                          width: `${Math.abs(grid[scale][type]) / 2}%`,
                          left:
                            grid[scale][type] >= 0
                              ? "50%"
                              : `${50 - Math.abs(grid[scale][type]) / 2}%`,
                          background:
                            grid[scale][type] >= 0
                              ? TYPE_INFO[type].color
                              : DISTRUST_COLOR,
                        }}
                      />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-current opacity-40" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-[1.45] opacity-75">
                {RESILIENCE_COPY[read.state].note}
              </p>
              {weight.type && (
                <p className="mt-1 text-[13px] leading-[1.45]">
                  <span className="font-semibold">Holding the weight: </span>
                  {TYPE_INFO[weight.type].name.toLowerCase()}
                  {weight.concentrated ? ", and everything leans on it." : "."}
                </p>
              )}
            </section>
          );
        })}
      </div>

      {shocks.length > 0 && (
        <div className="mt-12 max-w-[44em]">
          <h2 className={sectionLabelClasses}>How the shocks landed</h2>
          <ul className="mt-4 flex flex-col gap-5">
            {shocks.map((turn) => (
              <li key={turn.action.id} className="text-[15px] leading-[1.5]">
                <p className="font-semibold">{turn.action.label}</p>
                {turn.buffered.length > 0 ? (
                  turn.buffered.map((b) => (
                    <p key={`${b.scale}-${b.type}`} className="opacity-80">
                      {scenario.scales[b.scale].label}: about {b.saved} points
                      absorbed by{" "}
                      {b.by
                        .map((t) => TYPE_INFO[t].name.toLowerCase())
                        .join(" and ")}{" "}
                      trust.
                    </p>
                  ))
                ) : (
                  <p className="opacity-80">
                    Nothing was carrying the load, so the full loss landed.
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 max-w-[44em]">
        <h2 className={sectionLabelClasses}>Your run</h2>
        <ol className="mt-4 flex flex-col">
          {turns.map((turn, i) => (
            <li
              key={`${turn.action.id}-${i}`}
              className="flex items-baseline gap-3 py-2 text-[14px]"
              style={i > 0 ? { borderTop: `1px solid ${fg}1f` } : undefined}
            >
              <span className="w-6 flex-none tabular-nums opacity-40">
                {i + 1}
              </span>
              <span
                className="w-14 flex-none text-[11px] font-bold tracking-[0.06em] uppercase"
                style={{ color: KIND_COLOR[turn.action.kind] }}
              >
                {turn.action.kind === "shock"
                  ? "Shock"
                  : turn.action.kind === "build"
                    ? "Builds"
                    : "Damages"}
              </span>
              <span className="flex-1">{turn.action.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 flex max-w-[26em] gap-3">
        <button
          onClick={onAgain}
          className="flex-1 cursor-pointer rounded-full py-3 text-base font-bold"
          style={{ background: fg, color: bg }}
        >
          Shuffle and play again
        </button>
        <button
          onClick={onOther}
          className="flex-1 cursor-pointer rounded-full py-3 text-base font-bold"
          style={{ border: `1.5px solid ${fg}66` }}
        >
          Another situation
        </button>
      </div>
    </div>
  );
}
