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
 * preview the hidden state on localhost, or set it in Vercel's project
 * settings under a specific environment to override the default there.
 */
export function isProjectsSectionHidden(): boolean {
  return isProductionDeploy() || process.env.HIDE_PROJECTS === "true";
}
