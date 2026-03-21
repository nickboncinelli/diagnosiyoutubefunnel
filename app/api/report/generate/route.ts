import { NextRequest, NextResponse } from "next/server";
import { generatePdfBuffer } from "@/lib/pdf";
import { AnalysisResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const result: AnalysisResult = await req.json();

    if (!result || !result.score || !result.youtube) {
      return NextResponse.json(
        { error: "Dati risultato mancanti" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePdfBuffer(result);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="YouTube-Funnel-Score-${result.score.totalScore}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    const message =
      error instanceof Error ? error.message : "Errore generazione PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
