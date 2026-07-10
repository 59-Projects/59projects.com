import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { getAllProjects } from "@/lib/content";
import { sans } from "@/lib/fonts";
import { SITE_NAME } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://59projects.com"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Strategic design practice helping government agencies and mission-driven organizations get their teams working.",
  // Also served from the Vercel-provisioned 59projects-com.vercel.app domain;
  // this tells search engines 59projects.com is the one to index.
  alternates: {
    canonical: "/",
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
        <ThemeProvider>
          <Nav projects={navProjects} />
          {children}
          <DarkModeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
