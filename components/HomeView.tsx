"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { useTheme } from "@/components/ThemeProvider";
import type { HomeContent, Project } from "@/lib/schema";

interface HomeViewProps {
  home: HomeContent;
  projects: Project[];
}

export function HomeView({ home, projects }: HomeViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? home.fg : home.bg;
  const fg = isDark ? home.bg : home.fg;

  const heroImages = home.heroImages ?? [];

  // headlineColor/subtextColor are tuned as accents against the light
  // background (home.bg). In dark mode, use the page's own light color
  // (now sitting in `fg` post-swap) instead, so the text stays legible
  // against the near-black background rather than nearly disappearing.
  const headlineColor = isDark ? fg : home.headlineColor ?? fg;
  const subtextColor = isDark ? fg : home.subtextColor ?? fg;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: bg, color: fg }}
    >
      <div className="relative isolate w-full">
        <HeroSlideshow images={heroImages} />

        <div className="h-6 w-full md:h-[78px]" />

        <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-10 md:w-5/8 md:pt-60 md:pb-20">
          <h1
            className="text-[34px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[42px] md:leading-[1.05] lg:text-5xl"
            style={{ color: headlineColor }}
            dangerouslySetInnerHTML={{ __html: home.headline }}
          />
          <p
            className="home-subtext mt-4 text-lg leading-[1.3] font-normal tracking-[-0.02em] md:mt-5 md:pt-10 md:pr-40 md:text-xl md:leading-[1.25]"
            style={{ color: subtextColor }}
            dangerouslySetInnerHTML={{ __html: home.subtext }}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-[10px] px-[10px]">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={
              isDark
                ? { ...project, bg: project.fg, fg: project.bg }
                : project
            }
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
