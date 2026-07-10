import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";
import { markdownToHtml, markdownToInlineHtml } from "@/lib/markdown";
import { isProductionDeploy } from "@/lib/env";
import {
  projectFrontmatterSchema,
  aboutFrontmatterSchema,
  homeFrontmatterSchema,
  type ImageDimensions,
  type Project,
  type ProjectCredits,
  type ProjectFrontmatter,
  type AboutContent,
  type HomeContent,
} from "@/lib/schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const ABOUT_FILE = path.join(process.cwd(), "content", "about.md");
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
 * The projects section (homepage cards, Nav's project list, and the project
 * pages themselves) isn't ready to launch yet. Hiding it here, in one place,
 * keeps it out of production while still showing up locally and on Vercel
 * preview deployments, so it can be reviewed before going live. Remove this
 * guard when the section is ready to launch.
 */
const PROJECTS_SECTION_LIVE = !isProductionDeploy();

export async function getAllProjects(): Promise<Project[]> {
  if (!PROJECTS_SECTION_LIVE) {
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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!PROJECTS_SECTION_LIVE) {
    return null;
  }

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

  const bodyHtml = await markdownToHtml(content);
  return { ...parsed.data, bodyHtml };
}

export async function getHome(): Promise<HomeContent> {
  const { data, content } = readMarkdownFile(HOME_FILE);
  const parsed = homeFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid front matter in content/home.md:\n${parsed.error.toString()}`
    );
  }

  const [bodyHtml, headlineHtml, subtextHtml] = await Promise.all([
    markdownToHtml(content),
    markdownToInlineHtml(parsed.data.headline),
    markdownToInlineHtml(parsed.data.subtext),
  ]);

  return {
    ...parsed.data,
    headline: headlineHtml,
    subtext: subtextHtml,
    bodyHtml,
  };
}
