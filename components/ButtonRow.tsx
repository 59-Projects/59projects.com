"use client";

import posthog from "posthog-js";
import type { ProjectButton } from "@/lib/schema";

interface ButtonRowProps {
  buttons: ProjectButton[];
  fg: string;
}

export function ButtonRow({ buttons, fg }: ButtonRowProps) {
  if (buttons.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full max-w-[38em] flex-wrap gap-3">
      {buttons.map((button) => (
        <a
          key={`${button.text}-${button.url}`}
          href={button.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-[2px] px-4 py-[6px] text-sm font-semibold hover:opacity-70"
          style={{ border: `1px solid ${fg}40` }}
          onClick={() =>
            posthog.capture("project_button_clicked", {
              button_text: button.text,
              button_url: button.url,
            })
          }
        >
          {button.text} ↗
        </a>
      ))}
    </div>
  );
}
