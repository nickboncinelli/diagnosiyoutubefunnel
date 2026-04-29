"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import ScoreBadge from "@/components/ui/ScoreBadge";
import AreaBreakdown from "@/components/results/AreaBreakdown";
import Button from "@/components/ui/Button";
import BackstageLogo from "@/components/ui/BackstageLogo";
import { AnalysisResult } from "@/types";

const RadarChart = dynamic(() => import("@/components/results/RadarChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] flex items-center justify-center text-gray">
      Caricamento grafico...
    </div>
  ),
});

function ResultsContent() {
  const params = useParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try sessionStorage first
    const stored = sessionStorage.getItem(`result-${params.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
        setLoading(false);
        return;
      } catch {
        // Fall through to API fetch
      }
    }

    // Fetch from API
    fetch(`/api/score/calculate?id=${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Risultato non trovato");
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  // Fire Google Ads conversion when results load successfully
  useEffect(() => {
    if (!result || typeof window === "undefined") return;

    // Ensure dataLayer and gtag are available (mirrors the init in layout.tsx)
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function (...args: unknown[]) {
        window.dataLayer.push(args);
      };
    }

    window.gtag("event", "conversion", {
      send_to: "AW-18006685293/zALxCleC-aMcEO3soIpD",
    });
  }, [result]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray">Caricamento risultati...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Risultato non trovato</h2>
          <p className="text-gray mb-6">
            {error || "Questo link potrebbe essere scaduto. Prova a rifare la diagnosi."}
          </p>
          <Button onClick={() => (window.location.href = "/")} variant="outline">
            Nuova diagnosi
          </Button>
        </div>
      </div>
    );
  }

  const { score, youtube } = result;
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendar.app.google/JxzkkrfE9wwLYSgb8";

  const radarData = score.areas.map((a) => ({
    area: a.label,
    score: a.score,
    fullMark: 100,
  }));

  return (
    <div className="flex-1 px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <BackstageLogo size="md" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Il tuo YouTube Funnel Score
          </h1>
          {youtube && (
            <p className="text-gray">
              Diagnosi per <strong className="text-foreground">{youtube.channel.title}</strong>
            </p>
          )}
        </div>

        {/* Total Score */}
        <div className="text-center mb-12">
          <ScoreBadge score={score.totalScore} size="lg" />
        </div>

        {/* Radar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-center">
            Panoramica del tuo Funnel
          </h2>
          <RadarChart data={radarData} />
        </div>

        {/* SEO Score highlight */}
        {youtube && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Audit SEO del Canale</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">{youtube.metrics.seo.seoScore}/100</div>
                <div className="text-xs text-gray">SEO Score</div>
              </div>
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">{youtube.metrics.seo.avgTitleLength}</div>
                <div className="text-xs text-gray">Lungh. media titoli</div>
              </div>
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">{youtube.metrics.seo.descriptionsOptimized}%</div>
                <div className="text-xs text-gray">Descriz. ottimizzate</div>
              </div>
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">{youtube.metrics.seo.videosWithTags}%</div>
                <div className="text-xs text-gray">Video con tag</div>
              </div>
            </div>
            <div className="space-y-2">
              {youtube.metrics.seo.findings.map((finding, i) => (
                <div key={i} className="flex gap-2 text-sm text-foreground/80">
                  <span className="text-accent shrink-0">&#8226;</span>
                  <p>{finding}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Area Breakdowns */}
        <div className="space-y-6 mb-12">
          <h2 className="text-lg font-bold">Diagnosi dettagliata per area</h2>
          {score.areas.map((area) => (
            <AreaBreakdown key={area.area} area={area} />
          ))}
        </div>

        {/* CTA */}
        <div className="bg-card border border-accent/30 rounded-2xl p-8 md:p-10 text-center mb-6">
          <h2 className="text-2xl font-bold mb-3">
            Vuoi un report ancora piu&apos; completo?
          </h2>
          <p className="text-gray mb-6 max-w-md mx-auto">
            Con i dati di YouTube Analytics (watch time, retention, CTR, sorgenti di traffico)
            possiamo generare un report ultra-personalizzato con insights che non trovi da nessun&apos;altra parte.
          </p>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg">
              Prenota una call per la diagnosi avanzata
            </Button>
          </a>
          <p className="text-gray/50 text-xs mt-4">
            Un nostro consulente analizzerà i tuoi dati analytics per darti consigli personalizzati al 100%
          </p>
        </div>

        {/* Email note */}
        <div className="text-center text-sm text-gray mb-8">
          <p>
            Il report PDF completo e&apos; stato inviato alla tua email.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray/50 pt-8 border-t border-border">
          <p>&copy; {new Date().getFullYear()} Backstage Agency — backstagelab.co</p>
        </footer>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray">Caricamento...</p>
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </main>
  );
}
