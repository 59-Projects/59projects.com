import { readFile } from "node:fs/promises";
import path from "node:path";
import { getHome } from "@/lib/content";
import { SITE_URL } from "@/content/site";

const IMAGE_MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Reads a `public/`-relative image (e.g. "/images/foo.jpg") and returns it
 * as a base64 data URI, since Satori (next/og's renderer) needs an actual
 * image source, not a path, for local files, there's no server it can
 * request a relative URL from during generation.
 */
export async function loadImageDataUri(publicPath: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", publicPath);
  const buffer = await readFile(filePath);
  const mime = IMAGE_MIME_TYPES[path.extname(publicPath).toLowerCase()] ?? "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

/**
 * Shared background photo for every OgPhotoCard-based share image (home,
 * about, contact): a random pick from the homepage's own heroImages pool,
 * so every card feels like part of the same set without needing its own
 * dedicated photo field. Note most platforms cache og:image per URL, so in
 * practice this is "whichever photo rendered at the last deploy," not a
 * fresh roll on every share.
 */
export async function getRandomHeroPhotoDataUri(): Promise<string | undefined> {
  const home = await getHome();
  const images = home.heroImages ?? [];
  if (images.length === 0) {
    return undefined;
  }
  const chosen = images[Math.floor(Math.random() * images.length)];
  return loadImageDataUri(chosen);
}

/** Standard Open Graph / Twitter card image size. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

const FONTS_DIR = path.join(process.cwd(), "public/fonts/untitled-sans");

let fontData: Promise<[Buffer, Buffer]> | undefined;

/**
 * Bold (titles) and Regular (subtitles), read once per server process and
 * reused across every OG image route. `next/og`'s renderer (Satori) only
 * supports .ttf/.otf/.woff font data, not .woff2, and both weights together
 * stay well under the ~500KB font+code budget for these routes.
 */
function loadBrandFont() {
  fontData ??= Promise.all([
    readFile(path.join(FONTS_DIR, "UntitledSansWeb-Bold.woff")),
    readFile(path.join(FONTS_DIR, "UntitledSansWeb-Regular.woff")),
  ]);
  return fontData;
}

export async function brandFonts() {
  const [bold, regular] = await loadBrandFont();
  return [
    { name: "Untitled Sans", data: bold, style: "normal" as const, weight: 700 as const },
    { name: "Untitled Sans", data: regular, style: "normal" as const, weight: 400 as const },
  ];
}

interface OgCardProps {
  bg: string;
  fg: string;
  /** Small label above the title, e.g. a project number or "About". */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Defaults to the site's domain. */
  footer?: string;
}

/** Shared visual template for every generated share-preview image on the site. */
export function OgCard({
  bg,
  fg,
  eyebrow,
  title,
  subtitle,
  footer,
}: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: bg,
        color: fg,
        padding: "76px",
        fontFamily: "Untitled Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          opacity: 0.55,
          letterSpacing: 3,
        }}
      >
        {(eyebrow ?? "").toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 400,
              opacity: 0.75,
              maxWidth: 920,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          fontWeight: 700,
          opacity: 0.55,
          letterSpacing: 1,
        }}
      >
        {footer ?? SITE_URL.replace("https://", "")}
      </div>
    </div>
  );
}

interface OgPhotoCardProps {
  /** A data URI from loadImageDataUri(), or undefined to fall back to a plain dark card. */
  photoDataUri?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

/**
 * A full-bleed photo with a bottom gradient scrim and white text over it,
 * used for the homepage share card instead of the flat-color OgCard.
 */
export function OgPhotoCard({
  photoDataUri,
  eyebrow,
  title,
  subtitle,
  footer,
}: OgPhotoCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#1a1916",
        fontFamily: "Untitled Sans",
      }}
    >
      {photoDataUri ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoDataUri}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          background:
            "linear-gradient(to top, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.4) 42%, rgba(10,9,8,0.05) 70%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: "76px",
          color: "#f4f2ec",
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              opacity: 0.85,
              letterSpacing: 3,
              marginBottom: 18,
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: 820,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              opacity: 0.7,
              letterSpacing: 1,
              marginTop: 8,
            }}
          >
            {footer ?? SITE_URL.replace("https://", "")}
          </div>
        </div>
      </div>
    </div>
  );
}
