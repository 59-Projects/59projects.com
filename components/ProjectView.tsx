"use client";

import posthog from "posthog-js";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { MediaGallery } from "@/components/MediaGallery";
import { Prose } from "@/components/Prose";
import { CreditsBox } from "@/components/CreditsBox";
import { ButtonRow } from "@/components/ButtonRow";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { Project } from "@/lib/schema";

interface ProjectViewProps {
  project: Project;
}

export function ProjectView({ project }: ProjectViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? project.fg : project.bg;
  const fg = isDark ? project.bg : project.fg;

  const isFull = project.variant === "full";
  const hasExternalUrl = project.externalUrl !== "#";
  const deck = project.deck ?? project.description;
  const mediaItems = (project.media ?? []).map((src, index) => ({
    src,
    width: project.mediaDimensions?.[index]?.width,
    height: project.mediaDimensions?.[index]?.height,
  }));

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div className="h-[78px] w-full" />

      <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-11 pb-11">
        <span className="text-lg font-bold opacity-[0.55]">
          {project.number}
        </span>
        <div className="mt-[14px] text-[48px] leading-[1.05] font-extrabold tracking-[-0.02em] sm:text-[80px]">
          {project.title}
        </div>
        <div className="mt-5 flex flex-wrap items-baseline gap-5">
          <p className="max-w-[42em] text-xl leading-[1.4] font-normal">
            {deck}
          </p>
          {hasExternalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold whitespace-nowrap hover:opacity-70"
              style={{
                borderBottom: `1px solid ${fg}80`,
                paddingBottom: "2px",
              }}
              onClick={() =>
                posthog.capture("project_external_link_clicked", {
                  project_slug: project.slug,
                  project_title: project.title,
                  external_url: project.externalUrl,
                })
              }
            >
              View project ↗
            </a>
          ) : null}
        </div>
      </div>

      {isFull && project.heroImage && project.heroImageDimensions ? (
        <div className="w-full px-[clamp(20px,2.5vw,40px)]">
          <ImagePlaceholder
            src={project.heroImage}
            alt={`${project.title} hero`}
            fg={fg}
            sizes="100vw"
            priority
            className="h-[280px] w-full rounded-[4px] sm:h-[400px]"
          />
        </div>
      ) : null}

      {isFull && mediaItems.length > 0 ? (
        <MediaGallery
          items={mediaItems}
          alt={`${project.title} detail`}
          fg={fg}
        />
      ) : null}

      <div className="flex w-full px-[clamp(20px,2.5vw,40px)] pt-11">
        <Prose
          html={project.bodyHtml}
          color={fg}
          className={`max-w-[60em] text-[18px] leading-[1.6] ${
            isFull ? "opacity-[0.92]" : "opacity-[0.9]"
          }`}
        />
      </div>

      {project.credits ? (
        <div className="grid w-full grid-cols-1 gap-x-6 px-[clamp(20px,2.5vw,40px)] pt-11 sm:grid-cols-[minmax(120px,180px)_1fr]">
          <div aria-hidden="true" className="hidden sm:block" />
          <CreditsBox credits={project.credits} fg={fg} />
        </div>
      ) : null}

      {project.buttons && project.buttons.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-x-6 px-[clamp(20px,2.5vw,40px)] pt-5 sm:grid-cols-[minmax(120px,180px)_1fr]">
          <div aria-hidden="true" className="hidden sm:block" />
          <ButtonRow buttons={project.buttons} fg={fg} />
        </div>
      ) : null}

      <div className="mt-16 w-full">
        <Footer />
      </div>
    </div>
  );
}
