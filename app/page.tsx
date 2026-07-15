import { getAllProjects, getHome } from "@/lib/content";
import { HomeView } from "@/components/HomeView";
import { PageViewTracker } from "@/components/PageViewTracker";

export default async function HomePage() {
  const [projects, home] = await Promise.all([getAllProjects(), getHome()]);
  return (
    <>
      <PageViewTracker event="home_page_viewed" />
      <HomeView home={home} projects={projects} />
    </>
  );
}
