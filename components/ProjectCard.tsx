"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { Project } from "@/lib/schema";

interface ProjectCardProps {
  project: Pick<
    Project,
    "slug" | "number" | "title" | "description" | "bg" | "fg"
  >;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ background: project.bg, color: project.fg }}
      className="group flex w-full items-center justify-between gap-6 rounded-[16px] px-[clamp(20px,2.5vw,40px)] py-8 sm:py-[40px]"
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
