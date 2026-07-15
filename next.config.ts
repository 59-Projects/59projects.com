import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  images: {
    // Serve modern formats when the browser supports them; Next falls
    // back to the original format automatically otherwise.
    formats: ["image/avif", "image/webp"],
    // Every fixed-size crop actually used across the site (avatar, about
    // photo, grid shots, hero), plus the standard larger breakpoints for
    // the full-bleed hero image on wide viewports.
    imageSizes: [84, 220, 260, 280, 400],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    // ImagePlaceholder defaults to quality 85, the lightbox's zoomed view
    // uses 90; Next 16 requires every quality value actually used to be
    // declared here explicitly.
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
