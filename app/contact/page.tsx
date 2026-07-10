import type { Metadata } from "next";
import { getContact } from "@/lib/content";
import { ContactView } from "@/components/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const contact = await getContact();
  return <ContactView contact={contact} />;
}
