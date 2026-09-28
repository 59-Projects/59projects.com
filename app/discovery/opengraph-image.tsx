import { ImageResponse } from "next/og";
import {
  OgPhotoCard,
  OG_SIZE,
  brandFonts,
  getRandomHeroPhotoDataUri,
  loadImageDataUri,
} from "@/lib/og";
import { getDiscovery } from "@/lib/content";
import { SITE_NAME } from "@/content/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Discovery ${SITE_NAME}`;

export default async function Image() {
  const discovery = await getDiscovery();
  const [photoDataUri, fonts] = await Promise.all([
    discovery.photo
      ? loadImageDataUri(discovery.photo)
      : getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    <OgPhotoCard
      photoDataUri={photoDataUri}
      title={`Discovery ${SITE_NAME}`}
      subtitle="Why we start with discovery before any technology gets built."
    />,
    { ...OG_SIZE, fonts }
  );
}
