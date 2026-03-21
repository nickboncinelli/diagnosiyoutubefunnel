import { NextRequest, NextResponse } from "next/server";
import { generatePdfBuffer } from "@/lib/pdf";
import { sendReportEmail } from "@/lib/email";
import { AnalysisResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const result: AnalysisResult = await req.json();

    if (!result?.lead?.email || !result?.score) {
      return NextResponse.json(
        { error: "Dati mancanti per invio email" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePdfBuffer(result);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resultUrl = `${appUrl}/results/${result.id}`;

    await sendReportEmail({
      to: result.lead.email,
      name: result.lead.fullName,
      score: result.score.totalScore,
      resultUrl,
      pdfBuffer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    const message =
      error instanceof Error ? error.message : "Errore invio email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
