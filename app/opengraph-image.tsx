import { ImageResponse } from "next/og";
import { OgPhotoCard, OG_SIZE, brandFonts, getRandomHeroPhotoDataUri } from "@/lib/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/content/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = SITE_NAME;

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    (
      <OgPhotoCard
        photoDataUri={photoDataUri}
        title={SITE_NAME}
        subtitle={SITE_DESCRIPTION}
      />
    ),
    { ...OG_SIZE, fonts }
  );
}
