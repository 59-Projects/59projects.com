import type { Metadata } from "next";
import { getAbout } from "@/lib/content";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const about = await getAbout();
  return <AboutView about={about} />;
}
