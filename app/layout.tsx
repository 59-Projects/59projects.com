import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { getAllProjects } from "@/lib/content";
import { sans } from "@/lib/fonts";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  EMAIL,
} from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s – ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Also served from the Vercel-provisioned 59projects-com.vercel.app domain;
  // this tells search engines 59projects.com is the one to index.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

/**
 * Organization structured data, so search engines can associate the site
 * with the business itself (name, description, contact) rather than just
 * treating it as an unstructured document.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abiquiú",
    addressRegion: "NM",
    postalCode: "87510",
    addressCountry: "US",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const projects = await getAllProjects();
  const navProjects = projects.map(({ slug, number, title, bg, fg }) => ({
    slug,
    number,
    title,
    bg,
    fg,
  }));

  return (
    <html lang="en" className={sans.variable}>
      <body className="bg-cream text-ink-2 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <ThemeProvider>
          <Nav projects={navProjects} />
          {children}
          <DarkModeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
