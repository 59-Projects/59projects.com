"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface PhotoSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
}

const AUTO_ADVANCE_MS = 4000;

/**
 * Crossfades between `images` with the same hover-to-reveal dot indicators
 * as `HeroSlideshow` on the homepage, sized as a normal inline block (via
 * `className`) rather than a full-bleed hero. Auto-advances on a timer, in
 * addition to letting the dots jump to a specific image.
 */
export function PhotoSlideshow({ images, alt, className }: PhotoSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-[4px]",
        className
      )}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          priority={i === 0}
          sizes="320px"
          quality={85}
          className="object-cover object-top transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      {images.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className="h-2.5 w-2.5 cursor-pointer rounded-full transition-opacity"
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
