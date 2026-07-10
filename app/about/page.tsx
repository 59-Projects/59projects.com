import type { Metadata } from "next";
import { getAbout } from "@/lib/content";
import { AboutView } from "@/components/AboutView";
import { AboutPageTracker } from "@/components/AboutPageTracker";
import { SITE_NAME } from "@/content/site";

const TITLE = "About";
const DESCRIPTION =
  "59 Projects is a strategic design and civic technology consultancy based in Abiquiú, New Mexico, founded by Jeremy Zilar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default async function AboutPage() {
  const about = await getAbout();
  return (
    <>
      <AboutPageTracker />
      <AboutView about={about} />
    </>
  );
}
