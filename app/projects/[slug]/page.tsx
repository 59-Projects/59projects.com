import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { isProjectsSectionUnlisted } from "@/lib/env";
import { ProjectView } from "@/components/ProjectView";
import { SITE_NAME } from "@/content/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${SITE_NAME}`,
      description: project.description,
    },
    // Reachable by direct link even while the projects section as a whole
    // is unlisted (see `getProjectBySlug`), but kept out of search results
    // until it's ready to be listed for everyone.
    ...(isProjectsSectionUnlisted()
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectView project={project} />;
}
