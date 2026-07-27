"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

const STORAGE_KEY = "cookie-notice-dismissed";

/**
 * Matches the `--color-ink` / `--color-cream` theme tokens in globals.css.
 * Same fixed palette `DarkModeToggle` uses, regardless of the current
 * page's own colors, since this is a site-wide overlay, not page content.
 */
const INK = "#1a1916";
const CREAM = "#f4f2ec";

/**
 * A small, dismissible notice about PostHog analytics. Opting out calls
 * `posthog.opt_out_capturing()`, which PostHog persists on its own and
 * honors automatically on every future page load and `posthog.init()`
 * call, no extra bookkeeping needed here beyond not showing the banner
 * again once someone has dismissed it either way.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) {
      return;
    }
    // Reading a browser-only API (localStorage) once on mount to avoid an
    // SSR/client hydration mismatch, not state derived from props or other
    // state, so the usual "don't setState in an effect" concern doesn't
    // apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function optOut() {
    posthog.opt_out_capturing();
    dismiss();
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      style={{
        background: INK,
        color: CREAM,
        bottom: "clamp(16px, 2.5vw, 32px)",
        // Sits directly to the left of DarkModeToggle (a 40px circle at the
        // same bottom offset), same row, cleared by its width plus a gap.
        right: "calc(clamp(16px, 2.5vw, 32px) + 52px)",
      }}
      className="fixed z-[70] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-full py-2 pr-2 pl-4 text-xs shadow-[0_4px_16px_rgba(0,0,0,0.25)] sm:max-w-[360px]"
    >
      <p className="leading-snug opacity-90">
        This site uses cookies for basic analytics.{" "}
        <button
          type="button"
          onClick={optOut}
          className="cursor-pointer underline decoration-dotted underline-offset-2 hover:opacity-75"
        >
          Opt out
        </button>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss cookie notice"
        style={{ background: CREAM, color: INK }}
        className="flex h-6 w-6 flex-none cursor-pointer items-center justify-center rounded-full text-sm hover:opacity-85"
      >
        ×
      </button>
    </div>
  );
}
