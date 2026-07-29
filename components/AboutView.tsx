"use client";

import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PhotoSlideshow } from "@/components/PhotoSlideshow";
import { Prose } from "@/components/Prose";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import type { AboutContent } from "@/lib/schema";

/** Matches the `--color-cream` / `--color-ink` theme tokens in globals.css. */
const CREAM = "#f4f2ec";
const INK = "#1a1916";

interface AboutViewProps {
  about: AboutContent;
}

export function AboutView({ about }: AboutViewProps) {
  const { isDark } = useTheme();
  const bg = isDark ? INK : CREAM;
  const fg = isDark ? CREAM : INK;

  return (
    <div className="min-h-screen w-full" style={{ background: bg, color: fg }}>
      <div className="h-[78px] w-full" />

      <div className="flex w-full flex-col items-center px-[clamp(20px,2.5vw,40px)] py-24 sm:pt-24 sm:pb-[100px]">
        <ImagePlaceholder
          src={about.photo}
          alt={about.name}
          fg={fg}
          sizes="220px"
          minWidth={220}
          className="h-[220px] w-[220px] rounded-full"
        />

        <Prose
          html={about.bodyHtml}
          color={fg}
          className="mt-9 max-w-[42em] text-[18px] leading-[1.6] font-normal opacity-90"
        />

        {about.tailHtml ? (
          // `max-w-[756px]` matches the main body Prose's `max-w-[42em]` at
          // its 18px font size (42 * 18), so this column reads the same
          // width. `flow-root` (desktop only) gives the container its own
          // block formatting context so the floated photo's height is
          // included in the layout instead of spilling into the footer.
          <div className="flex w-full max-w-[756px] flex-col-reverse md:flow-root">
            {about.bottomPhotos && about.bottomPhotos.length > 0 ? (
              <div className="mx-auto mt-6 p-3 md:mx-0 md:float-right md:mt-0 md:mb-4 md:ml-8 md:p-4">
                <PhotoSlideshow
                  images={about.bottomPhotos}
                  alt={`${about.name} photo`}
                  className="h-[280px] w-[210px] md:h-[360px] md:w-[270px]"
                />
              </div>
            ) : null}
            <Prose
              html={about.tailHtml}
              color={fg}
              className="text-[18px] leading-[1.6] font-normal opacity-90 [&>*:first-child]:mt-[1.25em]"
            />
          </div>
        ) : about.bottomPhotos && about.bottomPhotos.length > 0 ? (
          <div className="mt-10 p-3">
            <PhotoSlideshow
              images={about.bottomPhotos}
              alt={`${about.name} photo`}
              className="h-[280px] w-[210px]"
            />
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
