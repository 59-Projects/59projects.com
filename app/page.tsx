import { getAllProjects, getDiscovery, getHome } from "@/lib/content";
import { isProjectsSectionUnlisted } from "@/lib/env";
import { HomeView } from "@/components/HomeView";
import { PageViewTracker } from "@/components/PageViewTracker";

export default async function HomePage() {
  const [projects, discovery, home] = await Promise.all([
    getAllProjects(),
    getDiscovery(),
    getHome(),
  ]);
  const recentProjects = isProjectsSectionUnlisted()
    ? discovery.examples
    : undefined;
  return (
    <>
      <PageViewTracker event="home_page_viewed" />
      <HomeView home={home} projects={projects} recentProjects={recentProjects} />
    </>
  );
}
