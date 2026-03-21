"use client";

export default function BackstageLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = {
    sm: { h: "h-6", gap: "gap-1.5", text: "text-base" },
    md: { h: "h-7", gap: "gap-2", text: "text-lg" },
    lg: { h: "h-9", gap: "gap-2.5", text: "text-2xl" },
  };

  const d = dims[size];

  return (
    <div className={`inline-flex items-center ${d.gap}`}>
      <svg viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={d.h}>
        <circle cx="12" cy="14" r="10" fill="#e6e6e6" />
        <polygon points="28,4 28,24 42,14" fill="#FF0000" />
      </svg>
      <span className={`${d.text} font-semibold tracking-[0.02em] text-foreground`} style={{ fontFamily: "var(--font-syne), sans-serif" }}>
        backstage
      </span>
    </div>
  );
}
