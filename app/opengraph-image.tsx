import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/share-card";

export const alt = "What's Next SK9 — a Friday note for families in Wilmslow, Handforth, Alderley Edge and Styal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <ShareCard
        kicker="Wilmslow · Handforth · Alderley Edge · Styal"
        title="A Friday note for families in SK9"
        detail="Careers, local opportunities and safe, practical AI use. Independent — not a school or council site."
      />
    ),
    { ...size },
  );
}
