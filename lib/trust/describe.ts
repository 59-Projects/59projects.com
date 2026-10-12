import type { Change, Scale, TrustType } from "./model";
import { SCALES, TYPES } from "./model";

const TYPE_WORDS: Record<TrustType, string> = {
  rational: "rational",
  affinitive: "affinitive",
  systems: "systems-based",
};

/** Where an effect lands, in the words used in the sentences and the tags. */
export const SCALE_WORDS: Record<Scale, string> = {
  person: "between people",
  org: "inside the organization",
  system: "in the system",
};

/** A piece of a sentence. `strong` marks the names of kinds of trust. */
export interface Part {
  text: string;
  strong?: boolean;
}

function joinScales(scales: Scale[]): string {
  const words = scales.map((s) => SCALE_WORDS[s]);
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function sentenceParts(
  changes: Change[],
  verb: string,
  subject: string
): Part[] {
  const largest = Math.max(...changes.map((c) => Math.abs(c.delta)));
  const adverb = largest >= 20 ? "sharply " : largest < 8 ? "slightly " : "";

  const items: Part[][] = TYPES.flatMap((type) => {
    const scales = SCALES.filter((scale) =>
      changes.some((c) => c.type === type && c.scale === scale)
    );
    return scales.length
      ? [
          [
            { text: `${TYPE_WORDS[type]} trust`, strong: true },
            { text: ` ${joinScales(scales)}` },
          ],
        ]
      : [];
  });

  const parts: Part[] = [{ text: `${subject} ${adverb}${verb} ` }];
  items.forEach((item, i) => {
    if (i > 0) {
      const last = i === items.length - 1;
      parts.push({ text: last ? ", and " : ", " });
    }
    parts.push(...item);
  });
  parts.push({ text: "." });
  return parts;
}

/**
 * Plain-language account of what a card did, in pieces so the names of the
 * kinds of trust can be emphasized: which kinds moved, in which direction,
 * and at which level. Leads with the larger move.
 */
export function describeChangesParts(changes: Change[]): Part[] {
  const up = changes.filter((c) => c.delta > 0);
  const down = changes.filter((c) => c.delta < 0);
  const total = (list: Change[]) =>
    list.reduce((sum, c) => sum + Math.abs(c.delta), 0);

  if (up.length === 0 && down.length === 0) return [];
  if (down.length === 0) return sentenceParts(up, "builds", "This");
  if (up.length === 0) return sentenceParts(down, "damages", "This");

  const upFirst = total(up) >= total(down);
  const first = upFirst
    ? sentenceParts(up, "builds", "This")
    : sentenceParts(down, "damages", "This");
  const second = upFirst
    ? sentenceParts(down, "damages", "It")
    : sentenceParts(up, "builds", "It");
  return [...first, { text: " " }, ...second];
}

/** The same account as plain text. */
export function describeChanges(changes: Change[]): string {
  return describeChangesParts(changes)
    .map((part) => part.text)
    .join("");
}

/** A card's raw effects as a list of changes, so they can be described. */
export function effectsToChanges(
  effects: Partial<Record<Scale, Partial<Record<TrustType, number>>>>
): Change[] {
  const changes: Change[] = [];
  for (const scale of SCALES) {
    for (const type of TYPES) {
      const delta = effects[scale]?.[type];
      if (delta) changes.push({ scale, type, delta });
    }
  }
  return changes;
}
