"use client";

import { useState } from "react";
import clsx from "clsx";
import { RotatedCircleImage } from "@/components/RotatedCircleImage";
import type { AnimationStyle } from "@/components/RotatedCircleImage";

interface RotatedCircleSlideshowProps {
  images: string[];
  className?: string;
}

// No UI control to change this anymore; edit here directly if you want a
// different style.
const ROTATION_STYLE: AnimationStyle = "static";

/**
 * Crossfades between `images` (always starting on the first one), with
 * hover-to-reveal dots along the bottom, rendering each image through
 * RotatedCircleImage instead of a plain <Image>.
 */
export function RotatedCircleSlideshow({
  images,
  className,
}: RotatedCircleSlideshowProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={clsx("group relative", className)}>
      {images.map((src, i) => (
        <div
          key={src}
          // `isolate` forces its own stacking context regardless of
          // opacity, so RotatedCircleImage's internal z-indexed ring
          // layers never leak out and paint over the dots/button below.
          className="absolute inset-0 isolate transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <RotatedCircleImage
            src={src}
            rotationStyle={ROTATION_STYLE}
            className="h-full w-full"
          />
        </div>
      ))}

      {images.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className="h-2.5 w-2.5 rounded-full transition-opacity"
                style={{
                  background: "#ffffff",
                  opacity: i === index ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
