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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderBottom: "20px solid white",
              }}
            />
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              borderLeft: "24px solid #FF0000",
            }}
          />
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#e6e6e6",
              letterSpacing: "0.05em",
            }}
          >
            backstage
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          Diagnosi YouTube
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#999",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Scopri quanto vende il tuo funnel YouTube in 3 minuti
        </p>

        {/* Red accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#FF0000",
            marginTop: "32px",
            borderRadius: "2px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
