import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { calculateFunnelScore } from "@/lib/scoring";
import { YouTubeAnalysis, QuizAnswers, LeadInfo, AnalysisResult } from "@/types";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// In-memory store for MVP (use Vercel KV in production)
const resultsStore = new Map<string, AnalysisResult>();

async function sendToGHL(lead: LeadInfo, totalScore: number, channelName: string) {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.error("GHL credentials not configured");
    return;
  }

  try {
    const nameParts = (lead.fullName || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Build payload without customFields (avoids 400 if fields don't exist in location)
    // Score, ruolo and channel are stored in tags for easy filtering
    const scoreTag = `score-${totalScore}`;
    const roleTag = lead.role ? `ruolo-${lead.role.toLowerCase().replace(/\s+/g, "-")}` : null;
    const tags = ["diagnosi-youtube", scoreTag];
    if (roleTag) tags.push(roleTag);

    const payload: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email: lead.email,
      source: "Diagnosi YouTube",
      tags,
    };
    if (lead.phone) payload.phone = lead.phone;
    if (lead.company) payload.companyName = lead.company;

    const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("GHL API error:", res.status, JSON.stringify(data));
    } else {
      console.log("GHL contact created:", data.contact?.id);
    }
  } catch (error) {
    console.error("GHL error:", error);
  }
}

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

    // Send lead to GHL CRM (server-side, non-blocking)
    sendToGHL(lead, score.totalScore, youtube?.channel?.title || "").catch(console.error);

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
