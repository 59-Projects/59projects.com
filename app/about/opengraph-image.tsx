import { ImageResponse } from "next/og";
import { OgPhotoCard, OG_SIZE, brandFonts, getRandomHeroPhotoDataUri } from "@/lib/og";
import { SITE_NAME } from "@/content/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `About ${SITE_NAME}`;

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    (
      <OgPhotoCard
        photoDataUri={photoDataUri}
        title={`About ${SITE_NAME}`}
        subtitle="A strategic design and civic technology consultancy run by Jeremy Zilar."
      />
    ),
    { ...OG_SIZE, fonts }
  );
}
