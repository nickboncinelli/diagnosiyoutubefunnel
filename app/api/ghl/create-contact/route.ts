import { NextRequest, NextResponse } from "next/server";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

export async function POST(req: NextRequest) {
  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("GHL credentials not configured");
      return NextResponse.json(
        { error: "GHL not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { lead, score, channelName } = body as {
      lead: {
        fullName: string;
        email: string;
        phone?: string;
        company?: string;
        role?: string;
      };
      score: number;
      channelName?: string;
    };

    if (!lead?.email || !lead?.fullName) {
      return NextResponse.json(
        { error: "Dati lead mancanti" },
        { status: 400 }
      );
    }

    // Split full name into first/last
    const nameParts = lead.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const ghlPayload: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      email: lead.email,
      phone: lead.phone || undefined,
      companyName: lead.company || undefined,
      source: "Diagnosi YouTube",
      tags: ["diagnosi-youtube"],
      customFields: [
        {
          key: "funnel_score",
          field_value: String(score),
        },
        {
          key: "ruolo",
          field_value: lead.role || "",
        },
        {
          key: "canale_youtube",
          field_value: channelName || "",
        },
      ],
    };

    const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(ghlPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("GHL API error:", data);
      return NextResponse.json(
        { error: "Errore creazione contatto GHL", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, contactId: data.contact?.id });
  } catch (error) {
    console.error("GHL create contact error:", error);
    const message =
      error instanceof Error ? error.message : "Errore GHL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
