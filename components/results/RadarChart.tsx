"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarChartProps {
  data: { area: string; score: number; fullMark: number }[];
}

export default function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#333333" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: "#e6e6e6", fontSize: 13, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "#666666", fontSize: 10 }}
          tickCount={5}
        />
        <Radar
          name="Punteggio"
          dataKey="score"
          stroke="#FF0000"
          fill="#FF0000"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0e0e0e",
            border: "1px solid #333333",
            borderRadius: 8,
            fontSize: 13,
            color: "#e6e6e6",
          }}
          formatter={(value) => [`${value}/100`, "Punteggio"]}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
