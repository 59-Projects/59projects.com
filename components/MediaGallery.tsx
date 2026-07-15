"use client";

import Image from "next/image";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface MediaGalleryItem {
  src: string;
  width?: number;
  height?: number;
}

/**
 * Mobile screenshots are already narrow by nature (portrait phone width),
 * so a smaller floor keeps them from cropping any more than necessary;
 * everything else (desktop screenshots, photos) gets a wider floor so a
 * thumbnail is still recognizable. Detected from the filename since
 * that's the one signal every project's media already has, no extra
 * frontmatter field needed.
 */
const MOBILE_MIN_WIDTH_PX = 125;
const DEFAULT_MIN_WIDTH_PX = 400;

function minWidthFor(src: string): number {
  return /mobile/i.test(src) ? MOBILE_MIN_WIDTH_PX : DEFAULT_MIN_WIDTH_PX;
}

interface MediaGalleryProps {
  items: MediaGalleryItem[];
  /** Base alt text; the image's 1-based position is appended, e.g. "Project detail 1". */
  alt: string;
  fg: string;
}

export function MediaGallery({ items, alt, fg }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Whether the current image is showing at full resolution (scrollable)
  // instead of scaled to fit the viewport. Reset any time the image
  // being viewed changes, so zoom never carries over to the next photo.
  const [isZoomed, setIsZoomed] = useState(false);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => {
    setActiveIndex(null);
    setIsZoomed(false);
  }, []);
  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % items.length
    );
    setIsZoomed(false);
  }, [items.length]);
  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + items.length) % items.length
    );
    setIsZoomed(false);
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, showNext, showPrev]);

  if (items.length === 0) {
    return null;
  }

  const active = activeIndex !== null ? items[activeIndex] : undefined;

  return (
    <>
      <div className="w-full overflow-x-auto pt-9 pb-8">
        <div className="flex w-fit snap-x gap-5 pl-[clamp(20px,2.5vw,40px)]">
          {items.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${alt} ${index + 1} larger`}
              className="flex-none cursor-pointer snap-start"
            >
              <ImagePlaceholder
                src={item.src}
                alt={`${alt} ${index + 1}`}
                fg={fg}
                width={item.width}
                height={item.height}
                minWidth={minWidthFor(item.src)}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-[260px] rounded-[4px]"
              />
            </button>
          ))}
          {/* Trailing spacer: padding-right alone gets clipped by scroll
              containers once content overflows, so use a real element to
              guarantee breathing room after the last image. */}
          <div
            aria-hidden="true"
            className="w-[clamp(20px,2.5vw,40px)] flex-none"
          />
        </div>
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center text-white/80 hover:text-white"
          >
            <CloseIcon />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute top-1/2 left-5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute top-1/2 right-5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <div
            onClick={(event) => event.stopPropagation()}
            className={clsx(
              isZoomed && "max-h-[92vh] max-w-[95vw] overflow-auto"
            )}
          >
            <Image
              src={active.src}
              alt={`${alt} ${(activeIndex ?? 0) + 1}`}
              width={active.width ?? 1600}
              height={active.height ?? 1200}
              quality={90}
              sizes={isZoomed ? undefined : "90vw"}
              onClick={() => setIsZoomed((zoomed) => !zoomed)}
              className={clsx(
                "rounded-[4px]",
                isZoomed
                  ? "h-auto w-auto max-w-none cursor-zoom-out"
                  : "h-auto max-h-[85vh] w-auto max-w-[90vw] cursor-zoom-in object-contain"
              )}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
