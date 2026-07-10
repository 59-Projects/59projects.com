import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The domain Vercel automatically provisions for this project; it always
 * mirrors the production deployment, same as the custom domain below.
 * Left in place (Vercel doesn't let you remove it), but visitors are sent
 * on to the real domain so it isn't treated as a second, duplicate site.
 *
 * Deliberately an exact hostname match rather than matching all *.vercel.app
 * hosts, so this doesn't touch per-branch preview deployment URLs, which
 * need to stay reachable on their own.
 */
const LEGACY_VERCEL_HOST = "59projects-com.vercel.app";
const CANONICAL_HOST = "59projects.com";

export default function proxy(request: NextRequest) {
  if (request.nextUrl.hostname === LEGACY_VERCEL_HOST) {
    const url = new URL(request.nextUrl);
    url.protocol = "https";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
