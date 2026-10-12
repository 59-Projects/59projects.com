import type { Metadata } from "next";
import { TrustCardsView } from "@/components/TrustCardsView";
import { TRUST_PALETTE } from "@/lib/trust/palette";
import { SITE_NAME } from "@/content/site";

const TITLE = "The trust card game";
const DESCRIPTION =
  "Draw cards, see what each one does to trust, and find out what holds when a shock lands.";

// Unlisted prototype: reachable by direct link only. Not in the sitemap or Nav.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: "/trust/play" },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/trust/play",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function TrustPlayPage() {
  return <TrustCardsView palette={TRUST_PALETTE} />;
}
