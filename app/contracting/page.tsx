import type { Metadata } from "next";
import { getContracting } from "@/lib/content";
import { ContractingView } from "@/components/ContractingView";
import { SITE_NAME } from "@/content/site";

const TITLE = "Contracting";
const DESCRIPTION =
  "How to bring 59 Projects onto your team or contract vehicle.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/contracting",
  },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: "/contracting",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default async function ContractingPage() {
  const contracting = await getContracting();
  return <ContractingView contracting={contracting} />;
}
