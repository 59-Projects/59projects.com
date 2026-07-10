import { ImageResponse } from "next/og";
import { OgPhotoCard, OG_SIZE, brandFonts, getRandomHeroPhotoDataUri } from "@/lib/og";
import { SITE_NAME, EMAIL } from "@/content/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Contact ${SITE_NAME}`;

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    (
      <OgPhotoCard
        photoDataUri={photoDataUri}
        title={`Contact ${SITE_NAME}`}
        subtitle={`Book a meeting, call, or email ${EMAIL}.`}
      />
    ),
    { ...OG_SIZE, fonts }
  );
}
