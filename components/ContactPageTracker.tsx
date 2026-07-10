"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function ContactPageTracker() {
  useEffect(() => {
    posthog.capture("contact_page_viewed");
  }, []);

  return null;
}
