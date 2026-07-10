"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import posthog from "posthog-js";
import { SITE_NAME } from "@/content/site";
import { useTheme } from "@/components/ThemeProvider";

export interface NavProject {
  slug: string;
  number: string;
  title: string;
  bg: string;
  fg: string;
}

interface NavProps {
  projects: NavProject[];
}

/** Matches the `--color-ink` / `--color-cream` theme tokens in globals.css. */
const DEFAULT_PAGE_BG = "#f4f2ec";
const DEFAULT_PAGE_FG = "#1a1916";

const pillClasses =
  "text-sm font-medium rounded-[2px] px-[10px] py-[4px] hover:opacity-85";

const menuItemClasses =
  "block px-[22px] py-[11px] text-sm font-semibold text-cream hover:bg-cream/[0.08]";

export function Nav({ projects }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = useTheme();
  const isProjectPage = pathname?.startsWith("/projects/") ?? false;
  const currentSlug = isProjectPage ? pathname?.split("/")[2] : undefined;

  const orderedProjects = [...projects].sort(
    (a, b) => Number(a.number) - Number(b.number)
  );

  const activeProject = orderedProjects.find(
    (project) => project.slug === currentSlug
  );

  // The current page's own bg/fg pair, swapped when dark mode is on.
  const lightBg = activeProject?.bg ?? DEFAULT_PAGE_BG;
  const lightFg = activeProject?.fg ?? DEFAULT_PAGE_FG;
  const pageBg = isDark ? lightFg : lightBg;
  const pageFg = isDark ? lightBg : lightFg;

  // Pills use the page's text color as their background, for contrast.
  const navBg = pageFg;
  const navFg = pageBg;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] w-full bg-transparent">
      <div className="flex w-full items-center justify-between px-[clamp(5px,2.5vw,10px)] py-2">
        <div className="flex items-center gap-[10px]">
          <Link
            href="/"
            style={{ background: navBg, color: navFg }}
            className={`${pillClasses} tracking-[-0.01em]`}
          >
            {SITE_NAME}
          </Link>
          <Link
            href={isProjectPage ? "/" : "/about"}
            style={{ background: navBg, color: navFg }}
            className={pillClasses}
          >
            {isProjectPage ? "Projects" : "About"}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next) {
              posthog.capture("nav_menu_opened");
            }
          }}
          style={{ background: navBg }}
          className="flex h-[32px] w-[32px] flex-none cursor-pointer items-center justify-center rounded-[2px] hover:opacity-85"
        >
          <span className="flex flex-col gap-[3px]">
            <span style={{ background: navFg }} className="block h-[2px] w-4" />
            <span style={{ background: navFg }} className="block h-[2px] w-4" />
            <span style={{ background: navFg }} className="block h-[2px] w-4" />
          </span>
        </button>
      </div>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={close}
            aria-hidden="true"
          />
          <div className="bg-ink absolute top-[70px] right-[clamp(20px,2.5vw,40px)] z-[65] min-w-[220px] rounded-[6px] py-[10px] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <Link
              href="/"
              onClick={() => {
                posthog.capture("nav_menu_link_clicked", {
                  label: "Home",
                  href: "/",
                });
                close();
              }}
              className={menuItemClasses}
            >
              Home
            </Link>
            {orderedProjects.length > 0 ? (
              <>
                <div className="border-cream/[0.14] my-[6px] border-t" />
                {orderedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    onClick={() => {
                      posthog.capture("nav_menu_link_clicked", {
                        label: project.title,
                        href: `/projects/${project.slug}`,
                        project_slug: project.slug,
                      });
                      close();
                    }}
                    className={menuItemClasses}
                  >
                    {project.title}
                  </Link>
                ))}
              </>
            ) : null}
            <div className="border-cream/[0.14] my-[6px] border-t" />
            <Link
              href="/about"
              onClick={() => {
                posthog.capture("nav_menu_link_clicked", {
                  label: "About",
                  href: "/about",
                });
                close();
              }}
              className={menuItemClasses}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => {
                posthog.capture("nav_menu_link_clicked", {
                  label: "Contact",
                  href: "/contact",
                });
                close();
              }}
              className={menuItemClasses}
            >
              Contact
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
