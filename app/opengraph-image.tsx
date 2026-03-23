import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Diagnosi YouTube | Backstage Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Circle */}
          <div
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          {/* Red triangle (play button) - overlapping to the right */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "100px solid transparent",
              borderBottom: "100px solid transparent",
              borderLeft: "170px solid #FF0000",
              marginLeft: "-60px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
