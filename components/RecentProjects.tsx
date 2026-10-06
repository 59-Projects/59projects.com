const sectionLabelClasses =
  "text-sm font-semibold tracking-[0.06em] uppercase opacity-55";

export interface RecentProject {
  title: string;
  /** The client or partner the project was done for, rendered under the title. */
  org?: string;
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  body: string;
  tags?: string[];
}

interface RecentProjectsProps {
  projects: RecentProject[];
  /** The page's own background color. */
  bg: string;
  /** The page's own text color. */
  fg: string;
  /** `"dark"` draws the section in the page's opposite colors; `"light"` uses the page's own colors. */
  tone?: "light" | "dark";
  title?: string;
}

/**
 * A numbered list of past engagements, drawn as a full-width section. Numbers
 * count down so the newest project sits at the top of the list.
 */
export function RecentProjects({
  projects,
  bg,
  fg,
  tone = "dark",
  title = "Recent Projects",
}: RecentProjectsProps) {
  const surface = tone === "dark" ? fg : bg;
  const ink = tone === "dark" ? bg : fg;

  return (
    <div
      className="w-full px-[clamp(20px,2.5vw,40px)] py-10 sm:py-14"
      style={{ background: surface, color: ink }}
    >
      <h2 className={sectionLabelClasses}>{title}</h2>
      <div className="mt-6 flex flex-col">
        {projects.map((item, index) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-10"
            style={index > 0 ? { borderTop: `1px solid ${ink}30` } : undefined}
          >
            <span className="flex-none text-lg font-bold tabular-nums opacity-40 sm:w-10">
              {String(projects.length - index).padStart(2, "0")}
            </span>
            <div className="flex-none sm:w-60">
              <h3 className="text-xl font-bold tracking-[-0.01em]">
                {item.title}
              </h3>
              {item.org ? (
                <p className="mt-1 text-sm leading-[1.4] opacity-65">
                  {item.org}
                </p>
              ) : null}
            </div>
            <div className="max-w-[44em]">
              <p
                className="text-base leading-[1.55] opacity-80"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
              {item.tags ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-3 py-0.5 text-xs"
                      style={{ borderColor: `${ink}66` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
