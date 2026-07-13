import { ImageResponse } from "next/og";
import { OgPhotoCard, OG_SIZE, brandFonts, getRandomHeroPhotoDataUri } from "@/lib/og";
import { SITE_NAME } from "@/content/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Contracting ${SITE_NAME}`;

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    (
      <OgPhotoCard
        photoDataUri={photoDataUri}
        title={`Contracting ${SITE_NAME}`}
        subtitle="How to bring 59 Projects onto your team or contract vehicle."
      />
    ),
    { ...OG_SIZE, fonts }
  );
}
