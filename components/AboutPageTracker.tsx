"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function AboutPageTracker() {
  useEffect(() => {
    posthog.capture("about_page_viewed");
  }, []);

  return null;
}
