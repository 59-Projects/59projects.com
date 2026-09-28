import type { Metadata } from "next";
import { getDiscovery } from "@/lib/content";
import { DiscoveryView } from "@/components/DiscoveryView";
import { PageViewTracker } from "@/components/PageViewTracker";
import { SITE_NAME } from "@/content/site";

const TITLE = "Discovery";
const DESCRIPTION =
  "Why we start with discovery before any technology gets built, and why lightweight prototypes are part of that discovery, not a step after it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/discovery",
  },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/discovery",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default async function DiscoveryPage() {
  const discovery = await getDiscovery();
  return (
    <>
      <PageViewTracker event="discovery_page_viewed" />
      <DiscoveryView discovery={discovery} />
    </>
  );
}
