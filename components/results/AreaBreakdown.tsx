"use client";

import { AreaScore } from "@/types";

function scoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-danger";
}

export default function AreaBreakdown({ area }: { area: AreaScore }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{area.label}</h3>
        <span className={`text-2xl font-bold ${scoreColor(area.score)}`}>
          {area.score}/100
        </span>
      </div>

      {/* Score bar */}
      <div className="w-full h-2 bg-foreground/10 rounded-full mb-5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${scoreBg(area.score)}`}
          style={{ width: `${area.score}%` }}
        />
      </div>

      {/* Findings */}
      <div className="space-y-3 mb-4">
        {area.findings.map((finding, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-accent mt-0.5 shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="currentColor" fillOpacity="0.15" />
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-sm text-foreground/80 leading-relaxed">{finding}</p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex gap-2 items-start">
          <span className="text-lg">&#128161;</span>
          <p className="text-sm font-medium text-foreground/90">{area.tip}</p>
        </div>
      </div>
    </div>
  );
}
