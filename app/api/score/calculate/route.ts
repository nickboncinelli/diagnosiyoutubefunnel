import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { calculateFunnelScore } from "@/lib/scoring";
import { YouTubeAnalysis, QuizAnswers, LeadInfo, AnalysisResult } from "@/types";

// In-memory store for MVP (use Vercel KV in production)
const resultsStore = new Map<string, AnalysisResult>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { youtube, quizAnswers, lead } = body as {
      youtube: YouTubeAnalysis;
      quizAnswers: QuizAnswers;
      lead: LeadInfo;
    };

    if (!youtube || !quizAnswers || !lead) {
      return NextResponse.json(
        { error: "Dati mancanti per il calcolo" },
        { status: 400 }
      );
    }

    const score = calculateFunnelScore(youtube, quizAnswers);
    const id = uuidv4();

    const result: AnalysisResult = {
      id,
      createdAt: new Date().toISOString(),
      lead,
      youtube,
      quizAnswers,
      score,
    };

    resultsStore.set(id, result);

    return NextResponse.json({ id, score });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore nel calcolo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID richiesto" }, { status: 400 });
  }

  const result = resultsStore.get(id);
  if (!result) {
    return NextResponse.json({ error: "Risultato non trovato" }, { status: 404 });
  }

  return NextResponse.json(result);
}
