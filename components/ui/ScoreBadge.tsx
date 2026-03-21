"use client";

export default function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 70
      ? "text-success"
      : score >= 40
        ? "text-warning"
        : "text-danger";

  const bgColor =
    score >= 70
      ? "bg-success/10 border-success/20"
      : score >= 40
        ? "bg-warning/10 border-warning/20"
        : "bg-danger/10 border-danger/20";

  const sizes = {
    sm: "text-2xl p-3",
    md: "text-5xl p-6",
    lg: "text-7xl p-8",
  };

  return (
    <div
      className={`${bgColor} ${sizes[size]} rounded-2xl inline-flex flex-col items-center justify-center animate-score border`}
    >
      <span className={`${color} font-bold`}>{score}</span>
      <span className="text-sm text-gray font-medium mt-1">/100</span>
    </div>
  );
}
