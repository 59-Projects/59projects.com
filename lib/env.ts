/**
 * Vercel sets `VERCEL_ENV` to `"production"` only for the production
 * domain's build, `"preview"` for branch/PR deployments, and leaves it
 * unset for local dev and local builds.
 */
function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * True on the live production site automatically (via `VERCEL_ENV`), and
 * anywhere else `HIDE_PROJECTS=true` is set, including locally: add it to
 * a `.env.local` file (gitignored, create it if it doesn't exist yet) to
 * preview the unlisted state on localhost, or set it in Vercel's project
 * settings under a specific environment to override the default there.
 *
 * This only controls whether projects are *listed* (homepage, nav menu,
 * sitemap): individual project pages still render at their direct URL
 * either way, so a link can be shared with someone before the section
 * officially launches. See `getProjectBySlug` in `lib/content.ts`.
 */
export function isProjectsSectionUnlisted(): boolean {
  return isProductionDeploy() || process.env.HIDE_PROJECTS === "true";
}
