"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { RotatedCircleSlideshow } from "@/components/RotatedCircleSlideshow";
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

  // The hero image's own box stretches all the way down behind the project
  // list (see the comment near that div below), so its image switcher dots
  // can't just anchor to the bottom of that box on desktop, they'd end up
  // behind the footer. Instead, measure the headline/subtext column's own
  // height and hand it to the slideshow as a CSS variable, so the dots can
  // sit near the bottom of the visual hero row itself.
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [heroContentHeight, setHeroContentHeight] = useState<number | null>(
    null
  );

  useEffect(() => {
    const el = heroContentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setHeroContentHeight(el.offsetTop + el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // headlineColor/subtextColor are tuned as accents against the light
  // background (home.bg). In dark mode, use the page's own light color
  // (now sitting in `fg` post-swap) instead, so the text stays legible
  // against the near-black background rather than nearly disappearing.
  const headlineColor = isDark ? fg : (home.headlineColor ?? fg);
  const subtextColor = isDark ? fg : (home.subtextColor ?? fg);

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div
        className="relative isolate w-full"
        style={
          heroContentHeight
            ? ({ "--hero-bottom": `${heroContentHeight}px` } as CSSProperties)
            : undefined
        }
      >
        {/* Experimenting with a rotated-circles treatment in place of the
            usual slideshow; swap back to <HeroSlideshow images={heroImages} />
            once we've decided on the look. */}
        <RotatedCircleSlideshow
          images={heroImages}
          className="-z-10 h-[280px] w-full md:absolute md:top-0 md:right-0 md:bottom-0 md:h-auto md:w-3/8"
        />

        <div className="h-6 w-full md:h-[78px]" />

        <div
          ref={heroContentRef}
          className="w-full px-[clamp(20px,2.5vw,40px)] pt-4 pb-10 md:w-5/8 md:pt-60 md:pb-20"
        >
          <h1
            className="text-[34px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[42px] md:leading-[1.05] lg:text-5xl"
            style={{ color: headlineColor }}
            dangerouslySetInnerHTML={{ __html: home.headline }}
          />
          <p
            className="inherit-color-link mt-4 text-lg leading-[1.3] font-normal tracking-[-0.02em] md:mt-5 md:pt-10 md:pr-20 md:text-xl md:leading-[1.25]"
            style={{ color: subtextColor }}
            dangerouslySetInnerHTML={{ __html: home.subtext }}
          />
        </div>

        {/*
          Kept inside the same `relative isolate` wrapper as the hero image
          above (rather than as its own sibling section) so the image, which
          is absolutely positioned to fill that wrapper's full height, reaches
          all the way down to the footer instead of stopping at the bottom
          of the headline/subtext block with a gap of plain background below.
        */}
        <div className="flex w-full flex-col gap-[10px] px-[10px] py-10">
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
      </div>

      <Footer />
    </div>
  );
}
