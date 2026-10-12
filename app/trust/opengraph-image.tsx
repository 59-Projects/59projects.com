import { ImageResponse } from "next/og";
import {
  OgPhotoCard,
  OG_SIZE,
  brandFonts,
  getRandomHeroPhotoDataUri,
} from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "How resilient is your team when a key person leaves?";

export default async function Image() {
  const [photoDataUri, fonts] = await Promise.all([
    getRandomHeroPhotoDataUri(),
    brandFonts(),
  ]);

  return new ImageResponse(
    <OgPhotoCard
      photoDataUri={photoDataUri}
      title="How resilient is your team when a key person leaves?"
      subtitle="Four kinds of trust, three scales, and a short card game."
    />,
    { ...OG_SIZE, fonts }
  );
}
