"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/schema";

interface ProjectCardProps {
  project: Pick<
    Project,
    "slug" | "number" | "title" | "description" | "bg" | "fg"
  >;
}

/**
 * Resting state is the same flat light-gray/black pairing on every card, so
 * the list reads as one plain index; each project's own colors only show
 * up on hover (or keyboard focus), via CSS custom properties so no
 * per-project class is needed. The global color transition in globals.css
 * handles the fade between the two.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={
        {
          "--project-bg": project.bg,
          "--project-fg": project.fg,
        } as CSSProperties
      }
      className="group pointer-events-auto flex w-full items-center justify-between gap-6 rounded-[16px] bg-neutral-200 px-[clamp(20px,2.5vw,40px)] py-8 text-black hover:bg-[var(--project-bg)] hover:text-[var(--project-fg)] focus-visible:bg-[var(--project-bg)] focus-visible:text-[var(--project-fg)] sm:py-[40px]"
      onClick={() =>
        posthog.capture("project_card_clicked", {
          project_slug: project.slug,
          project_title: project.title,
          project_number: project.number,
        })
      }
    >
      <div className="flex min-w-0 items-start gap-[22px]">
        <span className="flex-none text-[32px] leading-none font-bold tracking-[-0.02em] opacity-[0.55] sm:text-[36px]">
          {project.number}
        </span>
        <div className="flex min-w-0 flex-col gap-[10px]">
          <span className="text-[32px] leading-none font-extrabold tracking-[-0.02em] sm:text-[36px]">
            {project.title}
          </span>
          <span className="max-w-[40em] text-lg leading-[1.4] font-medium opacity-[0.72]">
            {project.description}
          </span>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="flex-none text-[28px] leading-none opacity-0 transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100 sm:text-[36px]"
      >
        →
      </span>
    </Link>
  );
}
