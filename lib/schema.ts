import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Expected a 6-digit hex color, e.g. #1a1916");

export const projectVariantSchema = z.enum(["full", "brief"]);
export type ProjectVariant = z.infer<typeof projectVariantSchema>;

/**
 * Who worked on the project and when, rendered as a credits box under the
 * body text. Open-ended on purpose: add whatever field you need directly in
 * a project's front matter (e.g. `awards: "..."`) and it renders automatically,
 * in the order it's written, with the key turned into a label (e.g. `development`
 * becomes "Development").
 */
export const projectCreditsSchema = z.record(z.string(), z.string().min(1));

export type ProjectCredits = z.infer<typeof projectCreditsSchema>;

/** A link rendered as a button below the credits box, e.g. "View the app". */
export const projectButtonSchema = z.object({
  text: z.string().min(1),
  url: z.string().min(1),
});

export type ProjectButton = z.infer<typeof projectButtonSchema>;

export const projectFrontmatterSchema = z.object({
  number: z
    .string()
    .regex(/^\d{2}$/, 'Expected a two-digit project number, e.g. "01"'),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Longer subtitle shown on the project detail page; falls back to `description` when unset. */
  deck: z.string().min(1).optional(),
  bg: hexColor,
  fg: hexColor,
  variant: projectVariantSchema,
  externalUrl: z.string().min(1).default("#"),
  heroImage: z.string().min(1).optional(),
  /** Additional images or animated gifs shown below the write-up. */
  media: z.array(z.string().min(1)).max(8).optional(),
  credits: projectCreditsSchema.optional(),
  /** Link buttons rendered below the credits box, e.g. a link to the live app. */
  buttons: z.array(projectButtonSchema).optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  bodyHtml: string;
  /** Intrinsic pixel size of `heroImage`, read from the file on disk. */
  heroImageDimensions?: ImageDimensions;
  /** Intrinsic pixel sizes of `media`, aligned by index. */
  mediaDimensions?: (ImageDimensions | undefined)[];
  /** `credits` fields rendered from markdown to inline HTML (links, etc.). */
  credits?: ProjectCredits;
}

export const aboutFrontmatterSchema = z.object({
  name: z.string().min(1),
  photo: z.string().min(1).optional(),
  /** Small candid photos shown at the bottom of the About page. */
  bottomPhotos: z.array(z.string().min(1)).max(4).optional(),
});

export type AboutFrontmatter = z.infer<typeof aboutFrontmatterSchema>;

export interface AboutContent extends AboutFrontmatter {
  bodyHtml: string;
  /**
   * The portion of the body from the `<!-- inline-photos-split -->` marker
   * onward (see `content/about.md`), rendered alongside `bottomPhotos` as a
   * slideshow instead of below the full body, on desktop. Empty when the
   * marker isn't present.
   */
  tailHtml: string;
  /** Intrinsic pixel sizes of `bottomPhotos`, aligned by index. */
  bottomPhotosDimensions?: (ImageDimensions | undefined)[];
}

export const contactFrontmatterSchema = z.object({
  name: z.string().min(1),
  photo: z.string().min(1).optional(),
});

export type ContactFrontmatter = z.infer<typeof contactFrontmatterSchema>;

export interface ContactContent extends ContactFrontmatter {
  bodyHtml: string;
}

export const contractingFrontmatterSchema = z.object({
  title: z.string().min(1),
  photo: z.string().min(1).optional(),
});

export type ContractingFrontmatter = z.infer<
  typeof contractingFrontmatterSchema
>;

export interface ContractingContent extends ContractingFrontmatter {
  bodyHtml: string;
}

/** One entry in the Services page's capabilities list or process sequence. */
export const serviceItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  /** Optional "Learn more" link rendered below the body, e.g. to a dedicated page about this item. */
  href: z.string().min(1).optional(),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;

export const servicesFrontmatterSchema = z.object({
  title: z.string().min(1),
  /** Supports inline markdown, e.g. `**bold**` or `[link](url)`. */
  hero: z.string().min(1),
  /** Smaller subtitle rendered directly below `hero`. Supports inline markdown. */
  deck: z.string().min(1).optional(),
  capabilities: z.array(serviceItemSchema).min(1),
  process: z.array(serviceItemSchema).min(1),
  /**
   * The page's own color pair, same idea as a project page's `bg`/`fg`:
   * swapped when the site's dark mode toggle is on, so the page stays
   * legible either way instead of always using one fixed pair.
   */
  bg: hexColor,
  fg: hexColor,
  /** Background photo for this page's Open Graph / share-preview image. Falls back to a random homepage hero image when unset. */
  photo: z.string().min(1).optional(),
  /** Supports inline markdown, e.g. `**bold**` or `[link](url)`. */
  closing: z.string().min(1),
});

export type ServicesFrontmatter = z.infer<typeof servicesFrontmatterSchema>;

export interface ServicesContent extends Omit<
  ServicesFrontmatter,
  "hero" | "deck" | "closing"
> {
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  hero: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  deck?: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  closing: string;
  bodyHtml: string;
}

/** One phase in the Discovery page's "How It Works" timeline (Before/During/After). */
export const howItWorksPhaseSchema = z.object({
  /** Short phase label, e.g. "Before", "During", "After". */
  phase: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export type HowItWorksPhase = z.infer<typeof howItWorksPhaseSchema>;

/** A single labeled link, used for the Discovery page's closing call-to-action buttons. */
export const ctaButtonSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1),
});

export type CtaButton = z.infer<typeof ctaButtonSchema>;

/** One "Recent Projects" entry. `body` supports inline markdown; `tags` render as pills under it. */
export const exampleItemSchema = z.object({
  title: z.string().min(1),
  /** The client or partner the project was done for, rendered under the title. */
  org: z.string().min(1).optional(),
  body: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
});

export type ExampleItem = z.infer<typeof exampleItemSchema>;

export const discoveryFrontmatterSchema = z.object({
  title: z.string().min(1),
  /** Supports inline markdown, e.g. `**bold**` or `[link](url)`. */
  hero: z.string().min(1),
  /** Smaller subtitle rendered directly below `hero`. Supports inline markdown. */
  deck: z.string().min(1).optional(),
  /** The problem half of the stat band, e.g. "Only **13%**... a line of code." Supports inline markdown. */
  statProblem: z.string().min(1),
  /** The answer half of the stat band, rendered larger and bolder. Supports inline markdown. */
  statAnswer: z.string().min(1),
  /** Lead sentence for "What Discovery Is", above the three cards. Supports inline markdown. */
  whatDiscoveryIsLead: z.string().min(1),
  /** The three "What Discovery Is" cards (listen / look for gaps / build a plan), rendered like Services' `capabilities`. */
  whatDiscoveryIsCards: z.array(serviceItemSchema).min(1),
  /** Lead sentence for "Grounded in Human-Centered Design", above the loop diagram. Supports inline markdown. */
  hcdLead: z.string().min(1),
  /** Second sentence for "Grounded in Human-Centered Design", below the loop diagram and above the principle cards. Supports inline markdown. */
  hcdBody: z.string().min(1),
  /** The four HCD principle cards (start with people / root causes / shared understanding / readiness). */
  hcdPrinciples: z.array(serviceItemSchema).min(1),
  /** The three "How It Works" phases (Before / During / After), each with its own sub-list. */
  howItWorks: z.array(howItWorksPhaseSchema).min(1),
  /** The "What we'll ask of you" items (owner / access to people / timeline). */
  askOfYou: z.array(serviceItemSchema).min(1),
  /** The Pennsylvania procurement callout under "Why This Matters". Supports inline markdown. */
  procurementCallout: z.string().min(1),
  /**
   * The pull-quote rendered via the `Quote` component in the middle of "Why
   * This Matters Before You Build Anything" (the ownership argument). Kept
   * separate from `hero`/`deck` on purpose: those introduce the page and can
   * change to fit whatever's being emphasized, but this quote is placed to
   * punctuate that specific section's argument and shouldn't drift with
   * them. Supports inline markdown.
   */
  quote: z.string().min(1).optional(),
  /** Lead sentence for "Why This Matters Before You Build", above its intro paragraph. Supports inline markdown. */
  whyMattersLead: z.string().min(1),
  /** Lead sentence for "What You Get", above the numbered list. Supports inline markdown. */
  whatYouGetLead: z.string().min(1),
  /** The numbered "What You Get" items, rendered as a two-column grid. Each supports inline markdown. */
  whatYouGet: z.array(z.string().min(1)).min(1),
  /** Lead sentence for "Why We Prototype", above the three cards. Supports inline markdown. */
  prototypeLead: z.string().min(1),
  /**
   * The three "Why We Prototype" cards (test ideas cheaply / build shared
   * language / learn during discovery). Field name kept from an earlier
   * version of this page (IDEO's prototyping principles), which this
   * content replaces; still rendered as connected cards like Services'
   * `process`.
   */
  principles: z.array(serviceItemSchema).min(1),
  /** Short engagement summaries, rendered as numbered rows like Services' `capabilities`. */
  examples: z.array(exampleItemSchema).min(1),
  bg: hexColor,
  fg: hexColor,
  /** Background photo for this page's Open Graph / share-preview image. Falls back to a random homepage hero image when unset. */
  photo: z.string().min(1).optional(),
  /** The closing CTA's large heading. Supports inline markdown. */
  closingHeading: z.string().min(1),
  /** The closing CTA's subhead, below `closingHeading`. Supports inline markdown. */
  closing: z.string().min(1),
  /** Primary closing CTA button. */
  ctaPrimary: ctaButtonSchema,
  /** Secondary closing CTA button. */
  ctaSecondary: ctaButtonSchema,
});

export type DiscoveryFrontmatter = z.infer<typeof discoveryFrontmatterSchema>;

export interface DiscoveryContent
  extends Omit<
    DiscoveryFrontmatter,
    | "hero"
    | "deck"
    | "statProblem"
    | "statAnswer"
    | "whatDiscoveryIsLead"
    | "hcdLead"
    | "hcdBody"
    | "procurementCallout"
    | "whyMattersLead"
    | "whatYouGetLead"
    | "whatYouGet"
    | "examples"
    | "quote"
    | "prototypeLead"
    | "closingHeading"
    | "closing"
  > {
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  hero: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  deck?: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  statProblem: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  statAnswer: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  whatDiscoveryIsLead: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  hcdLead: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  hcdBody: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  procurementCallout: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  whyMattersLead: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  whatYouGetLead: string;
  /** Each item rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  whatYouGet: string[];
  /** Each example's `body` rendered from markdown to inline HTML; `title` and `tags` stay plain. */
  examples: (Omit<ExampleItem, "body"> & { body: string })[];
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  quote?: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  prototypeLead: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  closingHeading: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  closing: string;
  /** Body content for "What Discovery Is": the "In practice" callout, before the why-matters split. */
  bodyHtml2: string;
  /** Body content for "Why This Matters"'s intro paragraph, before the ownership pull-quote. */
  bodyHtml2b: string;
  /** Body content for "Why This Matters"'s ownership detail, "In practice" callout, and procurement callout, after the ownership pull-quote. */
  bodyHtml2c: string;
  /** Body content for "Why We Prototype"'s closing line and "What You Get", after the prototype cards. */
  bodyHtml3: string;
  /** Body content for "Who's Behind This" and "Sources & Further Reading". */
  bodyHtml3b: string;
}

export const homeFrontmatterSchema = z.object({
  /** Supports inline markdown, e.g. `**bold**` or `[link](url)`. */
  headline: z.string().min(1),
  /** Supports inline markdown, e.g. `**bold**` or `[link](url)`. */
  subtext: z.string().min(1),
  bg: hexColor,
  fg: hexColor,
  /** Accent color for the headline; falls back to `fg` when unset. */
  headlineColor: hexColor.optional(),
  /** Accent color for the subtext line; falls back to `fg` when unset. */
  subtextColor: hexColor.optional(),
  /**
   * Background photo(s) for the hero, shown on the right half of the page.
   * When more than one is listed, a random one is picked on each page load.
   */
  heroImages: z.array(z.string().min(1)).min(1).optional(),
});

export type HomeFrontmatter = z.infer<typeof homeFrontmatterSchema>;

export interface HomeContent extends Omit<
  HomeFrontmatter,
  "headline" | "subtext"
> {
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  headline: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  subtext: string;
  bodyHtml: string;
}
