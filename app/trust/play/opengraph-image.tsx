import { ImageResponse } from "next/og";
import {
  OgPhotoCard,
  OG_SIZE,
  brandFonts,
  getRandomHeroPhotoDataUri,
} from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "The trust card game";

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    <OgPhotoCard
      photoDataUri={photoDataUri}
      title="The trust card game"
      subtitle="Draw cards, see what each one does to trust, and find out what holds when a shock lands."
    />,
    { ...OG_SIZE, fonts }
  );
}
