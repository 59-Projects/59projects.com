/**
 * Trust model for the /trust explainer.
 *
 * Based on Stern and Baird (2015), "Trust ecology and the resilience of
 * natural resource management institutions". Three of the paper's four trust
 * types move because of what people do (rational, affinitive, systems-based).
 * The fourth, dispositional, is a baseline, so it is not a meter here. It
 * changes how much a positive action helps.
 *
 * Everything in this file is a pure function, so it can be checked without
 * rendering anything.
 */

export const SCALES = ["person", "org", "system"] as const;
export const TYPES = ["rational", "affinitive", "systems"] as const;

export type Scale = (typeof SCALES)[number];
export type TrustType = (typeof TYPES)[number];

/** -100 is active distrust, 0 is no trust yet, 100 is full trust. */
export type Grid = Record<Scale, Record<TrustType, number>>;

export type Effects = Partial<
  Record<Scale, Partial<Record<TrustType, number>>>
>;

export type ActionKind = "build" | "damage" | "shock";

export interface TrustAction {
  id: string;
  kind: ActionKind;
  label: string;
  /** One plain sentence on what happens in the scenario. */
  summary: string;
  /** The mechanism from the research, in one sentence. */
  why: string;
  effects: Effects;
}

export interface Scenario {
  id: string;
  name: string;
  tagline: string;
  setting: string;
  atStake: string;
  scales: Record<Scale, { label: string; who: string }>;
  /** -1 (wary) to 1 (open). Scales how much a positive action helps. */
  dispositional: Record<Scale, number>;
  start: Grid;
  /** What each trust type tends to rest on, shown when it carries the most weight. */
  anchors: Partial<Record<Scale, Partial<Record<TrustType, string>>>>;
  actions: TrustAction[];
  shocks: TrustAction[];
}

export interface Buffered {
  scale: Scale;
  type: TrustType;
  /** Points of damage absorbed by the other trust types. */
  saved: number;
  by: TrustType[];
}

export interface Change {
  scale: Scale;
  type: TrustType;
  delta: number;
}

export interface Step {
  action: TrustAction;
  changes: Change[];
  buffered: Buffered[];
  grid: Grid;
}

const MIN = -100;
const MAX = 100;
/** Most of a shock the other trust types can absorb. */
const MAX_BUFFER = 0.6;
/** A type needs at least this much trust to count as present. */
const PRESENT = 20;

function clamp(value: number): number {
  return Math.max(MIN, Math.min(MAX, value));
}

export function cloneGrid(grid: Grid): Grid {
  return {
    person: { ...grid.person },
    org: { ...grid.org },
    system: { ...grid.system },
  };
}

/**
 * Positive effects are scaled by the dispositional baseline at that scale
 * (a wary group gives less credit for the same action). Shocks are softened
 * by whichever other trust types are present at that scale, which is the
 * buffering described in Table 1 of the paper.
 */
export function applyAction(
  grid: Grid,
  scenario: Scenario,
  action: TrustAction
): Step {
  const next = cloneGrid(grid);
  const changes: Change[] = [];
  const buffered: Buffered[] = [];

  for (const scale of SCALES) {
    const scaleEffects = action.effects[scale];
    if (!scaleEffects) continue;

    for (const type of TYPES) {
      const base = scaleEffects[type];
      if (base === undefined || base === 0) continue;

      let delta = base;
      if (base > 0) {
        delta = base * (1 + 0.3 * scenario.dispositional[scale]);
      } else if (action.kind === "shock") {
        const others = TYPES.filter((t) => t !== type);
        const carrying = others.filter((t) => grid[scale][t] >= PRESENT);
        const strength =
          carrying.reduce((sum, t) => sum + grid[scale][t], 0) /
          (others.length * MAX);
        const share = Math.min(MAX_BUFFER, strength);
        if (share > 0.02) {
          buffered.push({
            scale,
            type,
            saved: Math.round(-base * share),
            by: carrying,
          });
        }
        delta = base * (1 - share);
      }

      const before = next[scale][type];
      const after = clamp(before + delta);
      next[scale][type] = after;
      const actual = Math.round(after - before);
      if (actual !== 0) changes.push({ scale, type, delta: actual });
    }
  }

  return { action, changes, buffered, grid: next };
}

export function replay(scenario: Scenario, appliedIds: string[]): Step[] {
  const all = [...scenario.actions, ...scenario.shocks];
  const steps: Step[] = [];
  let grid = scenario.start;
  for (const id of appliedIds) {
    const action = all.find((a) => a.id === id);
    if (!action) continue;
    const step = applyAction(grid, scenario, action);
    steps.push(step);
    grid = step.grid;
  }
  return steps;
}

export type Resilience =
  "none" | "fragile" | "uneven" | "resilient" | "complacent";

export interface ScaleReadout {
  scale: Scale;
  state: Resilience;
  richness: number;
  evenness: number;
  distrust: TrustType[];
}

/**
 * Richness is how many types of trust are present. Evenness is how evenly
 * the trust is spread across them (Pielou's index over the present types
 * plus the missing ones, so one dominant type reads as uneven).
 */
export function assess(grid: Grid, scale: Scale): ScaleReadout {
  const values = TYPES.map((t) => grid[scale][t]);
  const positives = values.map((v) => Math.max(0, v));
  const richness = positives.filter((v) => v >= PRESENT).length;
  const total = positives.reduce((a, b) => a + b, 0);

  let evenness = 0;
  if (total > 0) {
    const entropy = positives.reduce((sum, v) => {
      if (v <= 0) return sum;
      const p = v / total;
      return sum - p * Math.log(p);
    }, 0);
    evenness = entropy / Math.log(TYPES.length);
  }

  const distrust = TYPES.filter((t) => grid[scale][t] <= -PRESENT);
  const lowest = Math.min(...values);

  let state: Resilience;
  if (richness === 0) state = "none";
  else if (richness === 1) state = "fragile";
  else if (richness === TYPES.length && evenness >= 0.85 && lowest >= 75)
    state = "complacent";
  else if (richness === TYPES.length && evenness >= 0.85) state = "resilient";
  else state = "uneven";

  return { scale, state, richness, evenness, distrust };
}

export interface WeightReadout {
  scale: Scale;
  type: TrustType | null;
  /** True when one type holds more than twice the next one. */
  concentrated: boolean;
  anchor?: string;
}

export function weightBearing(
  grid: Grid,
  scenario: Scenario,
  scale: Scale
): WeightReadout {
  const ranked = [...TYPES].sort((a, b) => grid[scale][b] - grid[scale][a]);
  const top = ranked[0];
  const second = ranked[1];
  if (grid[scale][top] < PRESENT) {
    return { scale, type: null, concentrated: false };
  }
  const concentrated =
    grid[scale][second] <= 0 || grid[scale][top] > 2 * grid[scale][second];
  return {
    scale,
    type: top,
    concentrated,
    anchor: scenario.anchors[scale]?.[top],
  };
}

/** The scale where a card moves the most trust, used to tag it on screen. */
export function primaryScale(action: TrustAction): Scale {
  let best: Scale = "org";
  let bestWeight = -1;
  for (const scale of SCALES) {
    const effects = action.effects[scale];
    if (!effects) continue;
    const weight = Object.values(effects).reduce(
      (sum, v) => sum + Math.abs(v ?? 0),
      0
    );
    if (weight > bestWeight) {
      best = scale;
      bestWeight = weight;
    }
  }
  return best;
}

/** Cells a card touches, as "scale:type" keys, without direction or size. */
export function touchedCells(action: TrustAction): string[] {
  const cells: string[] = [];
  for (const scale of SCALES) {
    for (const type of TYPES) {
      if (action.effects[scale]?.[type]) cells.push(`${scale}:${type}`);
    }
  }
  return cells;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Every build and damage card, shuffled, with two of the scenario's shocks
 * placed in the back half so there is something built before they land.
 * Shocks never sit next to each other.
 */
export function buildDeck(
  scenario: Scenario,
  random: () => number = Math.random
): TrustAction[] {
  const base = shuffle(scenario.actions, random);
  const shocks = shuffle(scenario.shocks, random).slice(0, 2);
  const total = base.length + shocks.length;
  const half = Math.floor(total / 2);

  const slots: number[] = [];
  const open = Array.from({ length: total - half }, (_, i) => half + i);
  for (const slot of shuffle(open, random)) {
    if (slots.every((s) => Math.abs(s - slot) > 1)) slots.push(slot);
    if (slots.length === shocks.length) break;
  }
  slots.sort((a, b) => a - b);

  const deck: TrustAction[] = [];
  let b = 0;
  let s = 0;
  for (let i = 0; i < total; i++) {
    deck.push(slots.includes(i) && s < shocks.length ? shocks[s++] : base[b++]);
  }
  return deck;
}
