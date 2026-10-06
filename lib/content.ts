import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";
import { markdownToHtml, markdownToInlineHtml } from "@/lib/markdown";
import { isProjectsSectionUnlisted } from "@/lib/env";
import {
  projectFrontmatterSchema,
  aboutFrontmatterSchema,
  contactFrontmatterSchema,
  contractingFrontmatterSchema,
  servicesFrontmatterSchema,
  discoveryFrontmatterSchema,
  homeFrontmatterSchema,
  type ImageDimensions,
  type Project,
  type ProjectCredits,
  type ProjectFrontmatter,
  type AboutContent,
  type ContactContent,
  type ContractingContent,
  type ServicesContent,
  type DiscoveryContent,
  type HomeContent,
} from "@/lib/schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const ABOUT_FILE = path.join(process.cwd(), "content", "about.md");
const CONTACT_FILE = path.join(process.cwd(), "content", "contact.md");
const CONTRACTING_FILE = path.join(process.cwd(), "content", "contracting.md");
const SERVICES_FILE = path.join(process.cwd(), "content", "services.md");
const DISCOVERY_FILE = path.join(process.cwd(), "content", "discovery.md");
const HOME_FILE = path.join(process.cwd(), "content", "home.md");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

/** Reads the intrinsic pixel size of a `public/`-relative image path, e.g. "/images/foo.jpg". */
function getImageDimensions(publicPath: string): ImageDimensions | undefined {
  const filePath = path.join(PUBLIC_DIR, publicPath);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const { width, height } = imageSize(fs.readFileSync(filePath));
  return width && height ? { width, height } : undefined;
}

/** Renders each filled-in credits field from markdown to inline HTML (so links work). */
async function buildCredits(
  credits: ProjectCredits | undefined
): Promise<ProjectCredits | undefined> {
  if (!credits) {
    return undefined;
  }

  const entries = await Promise.all(
    Object.entries(credits).map(async ([key, value]) => [
      key,
      value ? await markdownToInlineHtml(value) : value,
    ])
  );

  return Object.fromEntries(entries) as ProjectCredits;
}

async function buildProject(
  frontmatter: ProjectFrontmatter,
  slug: string,
  bodyHtml: string
): Promise<Project> {
  const heroImageDimensions = frontmatter.heroImage
    ? getImageDimensions(frontmatter.heroImage)
    : undefined;
  const mediaDimensions = frontmatter.media?.map((src) =>
    getImageDimensions(src)
  );
  const credits = await buildCredits(frontmatter.credits);

  return {
    ...frontmatter,
    slug,
    bodyHtml,
    heroImageDimensions,
    mediaDimensions,
    credits,
  };
}

/**
 * The projects section (homepage cards, Nav's project list, and the
 * sitemap) isn't ready to launch publicly yet. Hiding it here, in one
 * place, keeps it unlisted in production while still showing up locally
 * and on Vercel preview deployments, so it can be reviewed before going
 * live. This does NOT block the project pages themselves from rendering,
 * see `getProjectBySlug` below, so a direct link can still be shared with
 * someone ahead of launch. Remove this guard once the section is ready to
 * be listed for everyone.
 */
const PROJECTS_SECTION_LISTED = !isProjectsSectionUnlisted();

export async function getAllProjects(): Promise<Project[]> {
  if (!PROJECTS_SECTION_LISTED) {
    return [];
  }

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".md"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = readMarkdownFile(path.join(PROJECTS_DIR, file));

      const parsed = projectFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid front matter in content/projects/${file}:\n${parsed.error.toString()}`
        );
      }

      const bodyHtml = await markdownToHtml(content);

      return buildProject(parsed.data, slug, bodyHtml);
    })
  );

  return projects.sort((a, b) => Number(b.number) - Number(a.number));
}

/**
 * Deliberately not gated by `PROJECTS_SECTION_LISTED`: a project page
 * should still open for anyone with the direct URL even while the section
 * as a whole is unlisted, so specific case studies can be shared ahead of
 * a public launch.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { data, content } = readMarkdownFile(filePath);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/projects/${slug}.md:\n${parsed.error.toString()}`
    );
  }

  const bodyHtml = await markdownToHtml(content);
  return buildProject(parsed.data, slug, bodyHtml);
}

export async function getAbout(): Promise<AboutContent> {
  const { data, content } = readMarkdownFile(ABOUT_FILE);
  const parsed = aboutFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/about.md:\n${parsed.error.toString()}`
    );
  }

  const SPLIT_MARKER = "<!-- inline-photos-split -->";
  const splitIndex = content.indexOf(SPLIT_MARKER);
  const mainContent =
    splitIndex === -1 ? content : content.slice(0, splitIndex);
  const tailContent =
    splitIndex === -1 ? "" : content.slice(splitIndex + SPLIT_MARKER.length);

  const [bodyHtml, tailHtml] = await Promise.all([
    markdownToHtml(mainContent),
    tailContent.trim() ? markdownToHtml(tailContent) : Promise.resolve(""),
  ]);
  const bottomPhotosDimensions = parsed.data.bottomPhotos?.map((src) =>
    getImageDimensions(src)
  );
  return { ...parsed.data, bodyHtml, tailHtml, bottomPhotosDimensions };
}

export async function getContact(): Promise<ContactContent> {
  const { data, content } = readMarkdownFile(CONTACT_FILE);
  const parsed = contactFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/contact.md:\n${parsed.error.toString()}`
    );
  }

  const bodyHtml = await markdownToHtml(content);
  return { ...parsed.data, bodyHtml };
}

export async function getContracting(): Promise<ContractingContent> {
  const { data, content } = readMarkdownFile(CONTRACTING_FILE);
  const parsed = contractingFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/contracting.md:\n${parsed.error.toString()}`
    );
  }

  const bodyHtml = await markdownToHtml(content);
  return { ...parsed.data, bodyHtml };
}

export async function getServices(): Promise<ServicesContent> {
  const { data, content } = readMarkdownFile(SERVICES_FILE);
  const parsed = servicesFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/services.md:\n${parsed.error.toString()}`
    );
  }

  const [bodyHtml, heroHtml, deckHtml, closingHtml] = await Promise.all([
    markdownToHtml(content),
    markdownToInlineHtml(parsed.data.hero),
    parsed.data.deck ? markdownToInlineHtml(parsed.data.deck) : undefined,
    markdownToInlineHtml(parsed.data.closing),
  ]);

  return {
    ...parsed.data,
    hero: heroHtml,
    deck: deckHtml,
    closing: closingHtml,
    bodyHtml,
  };
}

export async function getDiscovery(): Promise<DiscoveryContent> {
  const { data, content } = readMarkdownFile(DISCOVERY_FILE);
  const parsed = discoveryFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/discovery.md:\n${parsed.error.toString()}`
    );
  }

  // In reading order: "What Discovery Is"'s "In practice" callout, the
  // why-matters split, "Why This Matters"'s intro (before the ownership pull
  // quote), the ownership-quote split, its ownership detail/procurement
  // callout (after the quote), the prototype split, "Why We Prototype"'s
  // closing line plus "What You Get", the what-you-get split, then "Who's
  // Behind This" and Sources. The structured sections in between (cards,
  // the HCD loop, How It Works, the client quote, Recent Projects) are
  // rendered by the component directly from frontmatter, not sliced out of
  // this markdown body.
  const WHY_MATTERS_MARKER = "<!-- why-matters-split -->";
  const OWNERSHIP_QUOTE_MARKER = "<!-- ownership-quote-split -->";
  const PROTOTYPE_MARKER = "<!-- prototype-split -->";
  const WHAT_YOU_GET_MARKER = "<!-- what-you-get-split -->";
  const whyMattersIndex = content.indexOf(WHY_MATTERS_MARKER);
  const ownershipQuoteIndex = content.indexOf(OWNERSHIP_QUOTE_MARKER);
  const prototypeIndex = content.indexOf(PROTOTYPE_MARKER);
  const whatYouGetIndex = content.indexOf(WHAT_YOU_GET_MARKER);

  const part2 =
    whyMattersIndex === -1 ? content : content.slice(0, whyMattersIndex);
  const part2b =
    whyMattersIndex === -1 || ownershipQuoteIndex === -1
      ? ""
      : content.slice(
          whyMattersIndex + WHY_MATTERS_MARKER.length,
          ownershipQuoteIndex
        );
  const part2c =
    ownershipQuoteIndex === -1 || prototypeIndex === -1
      ? ""
      : content.slice(
          ownershipQuoteIndex + OWNERSHIP_QUOTE_MARKER.length,
          prototypeIndex
        );
  const part3 =
    prototypeIndex === -1 || whatYouGetIndex === -1
      ? ""
      : content.slice(
          prototypeIndex + PROTOTYPE_MARKER.length,
          whatYouGetIndex
        );
  const part3b =
    whatYouGetIndex === -1
      ? ""
      : content.slice(whatYouGetIndex + WHAT_YOU_GET_MARKER.length);

  const [
    bodyHtml2,
    bodyHtml2b,
    bodyHtml2c,
    bodyHtml3,
    bodyHtml3b,
    heroHtml,
    deckHtml,
    statProblemHtml,
    statAnswerHtml,
    whatDiscoveryIsLeadHtml,
    hcdLeadHtml,
    hcdBodyHtml,
    procurementCalloutHtml,
    whyMattersLeadHtml,
    whatYouGetLeadHtml,
    quoteHtml,
    prototypeLeadHtml,
    closingHeadingHtml,
    closingHtml,
  ] = await Promise.all([
    part2.trim() ? markdownToHtml(part2) : Promise.resolve(""),
    part2b.trim() ? markdownToHtml(part2b) : Promise.resolve(""),
    part2c.trim() ? markdownToHtml(part2c) : Promise.resolve(""),
    part3.trim() ? markdownToHtml(part3) : Promise.resolve(""),
    part3b.trim() ? markdownToHtml(part3b) : Promise.resolve(""),
    markdownToInlineHtml(parsed.data.hero),
    parsed.data.deck
      ? markdownToInlineHtml(parsed.data.deck)
      : Promise.resolve(undefined),
    markdownToInlineHtml(parsed.data.statProblem),
    markdownToInlineHtml(parsed.data.statAnswer),
    markdownToInlineHtml(parsed.data.whatDiscoveryIsLead),
    markdownToInlineHtml(parsed.data.hcdLead),
    markdownToInlineHtml(parsed.data.hcdBody),
    markdownToInlineHtml(parsed.data.procurementCallout),
    markdownToInlineHtml(parsed.data.whyMattersLead),
    markdownToInlineHtml(parsed.data.whatYouGetLead),
    parsed.data.quote
      ? markdownToInlineHtml(parsed.data.quote)
      : Promise.resolve(undefined),
    markdownToInlineHtml(parsed.data.prototypeLead),
    markdownToInlineHtml(parsed.data.closingHeading),
    markdownToInlineHtml(parsed.data.closing),
  ]);

  const whatYouGetHtml = await Promise.all(
    parsed.data.whatYouGet.map((item) => markdownToInlineHtml(item))
  );
  const examplesHtml = await Promise.all(
    parsed.data.examples.map(async (example) => ({
      ...example,
      body: await markdownToInlineHtml(example.body),
    }))
  );

  return {
    ...parsed.data,
    hero: heroHtml,
    deck: deckHtml,
    statProblem: statProblemHtml,
    statAnswer: statAnswerHtml,
    whatDiscoveryIsLead: whatDiscoveryIsLeadHtml,
    hcdLead: hcdLeadHtml,
    hcdBody: hcdBodyHtml,
    procurementCallout: procurementCalloutHtml,
    whyMattersLead: whyMattersLeadHtml,
    whatYouGetLead: whatYouGetLeadHtml,
    whatYouGet: whatYouGetHtml,
    examples: examplesHtml,
    quote: quoteHtml,
    prototypeLead: prototypeLeadHtml,
    closingHeading: closingHeadingHtml,
    closing: closingHtml,
    bodyHtml2,
    bodyHtml2b,
    bodyHtml2c,
    bodyHtml3,
    bodyHtml3b,
  };
}

export async function getHome(): Promise<HomeContent> {
  const { data, content } = readMarkdownFile(HOME_FILE);
  const parsed = homeFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/home.md:\n${parsed.error.toString()}`
    );
  }

  const [bodyHtml, headlineHtml, subtextHtml, promoHtml] = await Promise.all([
    markdownToHtml(content),
    markdownToInlineHtml(parsed.data.headline),
    markdownToInlineHtml(parsed.data.subtext),
    parsed.data.promo
      ? markdownToInlineHtml(parsed.data.promo)
      : Promise.resolve(undefined),
  ]);

  return {
    ...parsed.data,
    headline: headlineHtml,
    subtext: subtextHtml,
    promo: promoHtml,
    bodyHtml,
  };
}
