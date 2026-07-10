/**
 * Vercel sets `VERCEL_ENV` to `"production"` only for the production
 * domain's build, `"preview"` for branch/PR deployments, and leaves it
 * unset for local dev and local builds. Used to hide work-in-progress
 * content everywhere except the live production site.
 */
export function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}
