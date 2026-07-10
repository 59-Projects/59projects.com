"use client";

import posthog from "posthog-js";
import { useTheme } from "@/components/ThemeProvider";

/** Matches the `--color-ink` / `--color-cream` theme tokens in globals.css. */
const INK = "#1a1916";
const CREAM = "#f4f2ec";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <line x1="12" y1="1.5" x2="12" y2="3.5" />
        <line x1="12" y1="20.5" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="3.5" y2="12" />
        <line x1="20.5" y1="12" x2="22.5" y2="12" />
        <line x1="4.5" y1="4.5" x2="5.9" y2="5.9" />
        <line x1="18.1" y1="18.1" x2="19.5" y2="19.5" />
        <line x1="4.5" y1="19.5" x2="5.9" y2="18.1" />
        <line x1="18.1" y1="5.9" x2="19.5" y2="4.5" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M20 13.2A8.2 8.2 0 1 1 10.8 4a6.3 6.3 0 0 0 9.2 9.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DarkModeToggle() {
  const { isDark, toggleDark } = useTheme();
  const background = isDark ? CREAM : INK;
  const color = isDark ? INK : CREAM;

  return (
    <button
      type="button"
      onClick={() => {
        posthog.capture("dark_mode_toggled", {
          mode: isDark ? "light" : "dark",
        });
        toggleDark();
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      style={{ background, color }}
      className="fixed right-[clamp(16px,2.5vw,32px)] bottom-[clamp(16px,2.5vw,32px)] z-[70] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:opacity-85"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
