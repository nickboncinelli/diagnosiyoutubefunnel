import { NextRequest, NextResponse } from "next/server";
import { analyzeChannel } from "@/lib/youtube";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL del canale YouTube richiesto" },
        { status: 400 }
      );
    }

    const analysis = await analyzeChannel(url);
    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore durante l'analisi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
