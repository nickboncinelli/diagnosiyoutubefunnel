import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Svg,
  Circle,
  Line,
  G,
  Polygon,
} from "@react-pdf/renderer";
import { AnalysisResult } from "@/types";

const colors = {
  primary: "#0A0A0A",
  accent: "#FF0000",
  success: "#22C55E",
  warning: "#EAB308",
  danger: "#EF4444",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  brandName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  brandSub: {
    fontSize: 9,
    color: colors.gray,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: colors.gray,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  channelInfo: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
  },
  channelName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  channelStats: {
    flexDirection: "row",
    gap: 20,
  },
  stat: {
    fontSize: 10,
    color: colors.gray,
  },
  statValue: {
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  scoreSection: {
    textAlign: "center",
    marginBottom: 25,
    padding: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 42,
    fontFamily: "Helvetica-Bold",
  },
  radarSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  areaSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
  },
  areaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  areaName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  areaScore: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  finding: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 10,
    color: "#374151",
  },
  tip: {
    fontSize: 10,
    marginTop: 6,
    paddingLeft: 10,
    color: colors.accent,
    fontFamily: "Helvetica-Bold",
  },
  nextSteps: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    color: colors.accent,
  },
  stepItem: {
    fontSize: 10,
    marginBottom: 6,
    paddingLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 9,
    color: colors.gray,
  },
  footerCta: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    marginTop: 4,
  },
});

function scoreColor(score: number): string {
  if (score >= 70) return colors.success;
  if (score >= 40) return colors.warning;
  return colors.danger;
}

function RadarChartPDF({ areas }: { areas: { label: string; score: number }[] }) {
  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const n = areas.length;

  const angleStep = (2 * Math.PI) / n;
  const levels = [25, 50, 75, 100];

  const pointX = (i: number, r: number) =>
    cx + r * Math.cos(angleStep * i - Math.PI / 2);
  const pointY = (i: number, r: number) =>
    cy + r * Math.sin(angleStep * i - Math.PI / 2);

  const dataPoints = areas
    .map((a, i) => {
      const r = (a.score / 100) * maxR;
      return `${pointX(i, r)},${pointY(i, r)}`;
    })
    .join(" ");

  return React.createElement(
    Svg,
    { width: 240, height: 240 },
    // Grid circles
    ...levels.map((level) =>
      React.createElement(Circle, {
        key: `grid-${level}`,
        cx: cx,
        cy: cy,
        r: (level / 100) * maxR,
        fill: "none",
        stroke: "#E5E7EB",
        strokeWidth: 0.5,
      })
    ),
    // Axis lines
    ...areas.map((_, i) =>
      React.createElement(Line, {
        key: `axis-${i}`,
        x1: cx,
        y1: cy,
        x2: pointX(i, maxR),
        y2: pointY(i, maxR),
        stroke: "#E5E7EB",
        strokeWidth: 0.5,
      })
    ),
    // Data polygon
    React.createElement(Polygon, {
      points: dataPoints,
      fill: "rgba(255, 0, 0, 0.15)",
      stroke: colors.accent,
      strokeWidth: 1.5,
    }),
    // Data points
    React.createElement(
      G,
      {},
      ...areas.map((a, i) => {
        const r = (a.score / 100) * maxR;
        return React.createElement(Circle, {
          key: `point-${i}`,
          cx: pointX(i, r),
          cy: pointY(i, r),
          r: 3,
          fill: colors.accent,
        });
      })
    )
  );
}

function generateNextSteps(result: AnalysisResult): string[] {
  const steps: string[] = [];
  const sorted = [...result.score.areas].sort((a, b) => a.score - b.score);

  steps.push(
    `1. Priorita': ${sorted[0].label} (${sorted[0].score}/100) — ${sorted[0].tip}`
  );
  if (sorted.length > 1) {
    steps.push(
      `2. Seconda priorita': ${sorted[1].label} (${sorted[1].score}/100) — ${sorted[1].tip}`
    );
  }
  steps.push(
    `3. Prenota una call gratuita con il team Backstage per un report avanzato con dati Analytics — backstagelab.co`
  );

  return steps;
}

function ReportDocument({ result }: { result: AnalysisResult }) {
  const { youtube, score, lead } = result;
  const dateStr = new Date(result.createdAt).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          {},
          React.createElement(Text, { style: styles.brandName }, "backstage"),
          React.createElement(Text, { style: styles.brandSub }, "YouTube Growth Partner")
        ),
        React.createElement(Text, { style: styles.date }, `Analisi del ${dateStr}`)
      ),
      // Title
      React.createElement(Text, { style: styles.title }, "YouTube Funnel Score Report"),
      // Channel info
      React.createElement(
        View,
        { style: styles.channelInfo },
        React.createElement(Text, { style: styles.channelName }, youtube.channel.title),
        React.createElement(
          View,
          { style: styles.channelStats },
          React.createElement(
            Text,
            { style: styles.stat },
            React.createElement(Text, { style: styles.statValue }, youtube.channel.subscriberCount.toLocaleString("it-IT")),
            " iscritti"
          ),
          React.createElement(
            Text,
            { style: styles.stat },
            React.createElement(Text, { style: styles.statValue }, youtube.channel.videoCount.toLocaleString("it-IT")),
            " video"
          ),
          React.createElement(
            Text,
            { style: styles.stat },
            React.createElement(Text, { style: styles.statValue }, youtube.channel.viewCount.toLocaleString("it-IT")),
            " views totali"
          )
        )
      ),
      // Score
      React.createElement(
        View,
        { style: styles.scoreSection },
        React.createElement(Text, { style: styles.scoreLabel }, "PUNTEGGIO COMPLESSIVO"),
        React.createElement(
          Text,
          { style: { ...styles.scoreValue, color: scoreColor(score.totalScore) } },
          `${score.totalScore}/100`
        )
      ),
      // Radar chart
      React.createElement(
        View,
        { style: styles.radarSection },
        React.createElement(RadarChartPDF, {
          areas: score.areas.map((a) => ({ label: a.label, score: a.score })),
        })
      ),
      // Area breakdowns
      ...score.areas.map((area) =>
        React.createElement(
          View,
          { key: area.area, style: styles.areaSection },
          React.createElement(
            View,
            { style: styles.areaHeader },
            React.createElement(Text, { style: styles.areaName }, area.label),
            React.createElement(
              Text,
              { style: { ...styles.areaScore, color: scoreColor(area.score) } },
              `${area.score}/100`
            )
          ),
          ...area.findings.map((f, i) =>
            React.createElement(Text, { key: `f-${i}`, style: styles.finding }, `• ${f}`)
          ),
          React.createElement(Text, { style: styles.tip }, `Consiglio: ${area.tip}`)
        )
      )
    ),
    // Page 2: Next steps
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.nextSteps },
        React.createElement(Text, { style: styles.nextStepsTitle }, "Prossimi Passi Consigliati"),
        ...generateNextSteps(result).map((step, i) =>
          React.createElement(Text, { key: `s-${i}`, style: styles.stepItem }, step)
        )
      ),
      React.createElement(
        View,
        { style: { marginTop: 30, textAlign: "center" } },
        React.createElement(
          Text,
          { style: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 8 } },
          "Vuoi un report ancora piu' completo?"
        ),
        React.createElement(
          Text,
          { style: { fontSize: 11, color: colors.gray, marginBottom: 15 } },
          `${lead.fullName}, prenota una call gratuita con il nostro team. Con i dati di YouTube Analytics possiamo generare un report ultra-personalizzato con watch time, retention, CTR e sorgenti di traffico.`
        ),
        React.createElement(
          Text,
          { style: { fontSize: 13, fontFamily: "Helvetica-Bold", color: colors.accent } },
          "Prenota qui: backstagelab.co"
        )
      ),
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          Text,
          { style: styles.footerText },
          "Questo report e' stato generato automaticamente da YouTube Funnel Score — Backstage Agency"
        ),
        React.createElement(Text, { style: styles.footerCta }, "backstagelab.co")
      )
    )
  );
}

export async function generatePdfBuffer(
  result: AnalysisResult
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = React.createElement(ReportDocument, { result }) as any;
  const buffer = await renderToBuffer(doc);
  return Buffer.from(buffer);
}
