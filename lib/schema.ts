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
});

export type AboutFrontmatter = z.infer<typeof aboutFrontmatterSchema>;

export interface AboutContent extends AboutFrontmatter {
  bodyHtml: string;
}

export const contactFrontmatterSchema = z.object({
  name: z.string().min(1),
  photo: z.string().min(1).optional(),
});

export type ContactFrontmatter = z.infer<typeof contactFrontmatterSchema>;

export interface ContactContent extends ContactFrontmatter {
  bodyHtml: string;
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

export interface HomeContent extends Omit<HomeFrontmatter, "headline" | "subtext"> {
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  headline: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  subtext: string;
  bodyHtml: string;
}
