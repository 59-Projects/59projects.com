import type { Metadata } from "next";
import { TrustExplainerView } from "@/components/TrustExplainerView";
import { TRUST_PALETTE } from "@/lib/trust/palette";
import { SITE_NAME } from "@/content/site";

const TITLE = "How resilient is your team when a key person leaves?";
const DESCRIPTION =
  "Resilient teams rest on more than one kind of trust. The four kinds, and a short card game that shows where your team's coordination is strong and where it is thin.";

// Unlisted prototype: reachable by direct link only. Not in the sitemap or Nav.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: "/trust" },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/trust",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function TrustPage() {
  return <TrustExplainerView palette={TRUST_PALETTE} />;
}
