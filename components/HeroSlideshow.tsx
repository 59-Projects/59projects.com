"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";

interface HeroSlideshowProps {
  images: string[];
}

/**
 * Fills its container with one of `images`, and shows click-to-advance dots
 * along the bottom once the container is hovered. Starts on a random image
 * client-side (after mount, so server/client HTML still matches) and picking
 * a dot jumps straight to that image.
 */
export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(Math.floor(Math.random() * images.length));
    }
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="group relative -z-10 h-[280px] w-full overflow-hidden md:absolute md:top-0 md:right-0 md:bottom-0 md:h-auto md:w-3/8">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={85}
          className="object-cover object-center transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  posthog.capture("hero_slideshow_advanced", {
                    from_index: index,
                    to_index: i,
                    total_images: images.length,
                  });
                  setIndex(i);
                }}
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
