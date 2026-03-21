import {
  YouTubeAnalysis,
  QuizAnswers,
  AreaScore,
  FunnelScore,
} from "@/types";
import { quizQuestions } from "./quiz-data";

// --- Area weights (3 areas) ---
const WEIGHTS = {
  attrazione: 0.40,
  fidelizzazione: 0.30,
  conversione: 0.30,
};

// --- Calculate score per quiz section ---

function calcSectionScore(
  section: "attrazione" | "fidelizzazione" | "conversione",
  answers: QuizAnswers
): number {
  const questions = quizQuestions.filter((q) => q.section === section);
  if (!questions.length) return 0;
  const total = questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  return Math.round(total / questions.length);
}

// --- Generate findings ---

function attrazioneFindings(
  yt: YouTubeAnalysis,
  answers: QuizAnswers
): { findings: string[]; tip: string } {
  const findings: string[] = [];
  const m = yt.metrics;

  // SEO findings from YouTube analysis
  if (m.seo.findings.length > 0) {
    findings.push(...m.seo.findings);
  }

  // Publishing frequency
  if (m.publishingFrequency < 2) {
    findings.push(
      `Pubblichi in media ${m.publishingFrequency.toFixed(1)} video al mese. Per attivare l'algoritmo di YouTube e generare traffico organico costante, dovresti puntare ad almeno 1 video a settimana.`
    );
  }

  // Engagement
  if (m.engagementRate < 2) {
    findings.push(
      `Il tuo tasso di engagement (${m.engagementRate}%) e' sotto la media. Questo suggerisce che i tuoi contenuti non stanno colpendo nel segno del tuo pubblico target, oppure che titoli e thumbnail non attirano il click giusto.`
    );
  }

  // Growth trend
  if (m.growthTrend === "declining") {
    findings.push(
      `Le views dei tuoi ultimi video mostrano un trend in calo del ${Math.abs(m.growthTrendPercent)}% rispetto ai precedenti. Questo puo' indicare un disallineamento tra cio' che il tuo pubblico cerca e cio' che stai pubblicando.`
    );
  }

  // Views/sub ratio
  if (m.viewsToSubRatio < 5) {
    findings.push(
      `Solo il ${m.viewsToSubRatio}% dei tuoi iscritti vede i tuoi video. Questo indica un problema di retention: YouTube non sta raccomandando i tuoi contenuti nemmeno ai tuoi iscritti.`
    );
  }

  // Positive finding
  if (m.avgViewsRecent10 > 2000 && m.engagementRate > 3) {
    findings.push(
      `Ottima performance! I tuoi video recenti hanno una media di ${m.avgViewsRecent10.toLocaleString("it-IT")} views con un engagement del ${m.engagementRate}%. Il tuo canale ha una base solida.`
    );
  }

  // SEO score summary
  findings.push(
    `SEO Score del canale: ${m.seo.seoScore}/100. ${m.seo.seoScore >= 70 ? "Buona ottimizzazione SEO." : m.seo.seoScore >= 40 ? "SEO nella media, c'e' margine di miglioramento." : "SEO da migliorare significativamente."}`
  );

  // Quiz-based findings for attraction
  if ((answers["attr_cta"] ?? 0) <= 25) {
    findings.push(
      "Non hai una call-to-action chiara nei tuoi video. Ogni video dovrebbe guidare lo spettatore verso il passo successivo."
    );
  }

  if ((answers["attr_thumbnails"] ?? 0) <= 30) {
    findings.push(
      "Le tue thumbnail non sono ottimizzate. Una thumbnail professionale puo' aumentare il CTR del 30-50%."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo canale ha metriche nella media. C'e' margine di miglioramento, soprattutto sulla costanza di pubblicazione e sull'engagement."
    );
  }

  const tip =
    m.seo.seoScore < 50
      ? "Priorita': ottimizza titoli (40-60 caratteri con keyword), descrizioni (150+ caratteri con link e timestamp) e aggiungi 8-15 tag rilevanti per ogni video."
      : m.publishingFrequency < 4
        ? "Aumenta la frequenza di pubblicazione ad almeno 1 video a settimana e ottimizza titoli e thumbnail per migliorare il CTR."
        : "Concentrati sull'ottimizzare la retention dei video (hook nei primi 30 secondi) e sulle CTA per convertire viewer in lead.";

  return { findings, tip };
}

function fidelizzazioneFindings(answers: QuizAnswers): { findings: string[]; tip: string } {
  const findings: string[] = [];

  if ((answers["fid_email_sequence"] ?? 0) === 0) {
    findings.push(
      "Non hai una sequenza email automatica. I lead che entrano nel tuo funnel ricevono zero touchpoint dopo il primo contatto -- il follow-up manuale non scala."
    );
  }
  if ((answers["fid_retargeting"] ?? 0) === 0) {
    findings.push(
      "Non fai retargeting sulle persone che visitano il tuo funnel. Il retargeting puo' aumentare le conversioni del 30-50% recuperando chi non ha convertito al primo contatto."
    );
  }
  if ((answers["fid_community"] ?? 0) <= 25) {
    findings.push(
      "Non hai una community attiva. Creare un punto di contatto diretto (Telegram, newsletter, gruppo) aumenta la fiducia e accelera il percorso da follower a cliente."
    );
  }
  if ((answers["fid_segmentation"] ?? 0) === 0) {
    findings.push(
      "Non segmenti i tuoi lead. Senza segmentazione, invii messaggi generici che non risuonano con le esigenze specifiche di ciascun lead."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo sistema di fidelizzazione e' ben impostato, con email automatiche, community e segmentazione attiva."
    );
  }

  const tip =
    (answers["fid_email_sequence"] ?? 0) === 0
      ? "Implementa una sequenza email di benvenuto di almeno 5 email che educhi il lead, costruisca fiducia e lo guidi verso la prenotazione di una call."
      : "Affina la segmentazione dei lead e personalizza le sequenze email in base al comportamento e agli interessi specifici.";

  return { findings, tip };
}

function conversioneFindings(answers: QuizAnswers): { findings: string[]; tip: string } {
  const findings: string[] = [];

  if ((answers["conv_lead_magnet"] ?? 0) === 0) {
    findings.push(
      "Non hai un lead magnet collegato al tuo canale YouTube. Stai lasciando sul tavolo una percentuale significativa dei potenziali lead che guardano i tuoi video."
    );
  }
  if ((answers["conv_rate"] ?? 0) <= 25) {
    findings.push(
      "Il tuo tasso di conversione da lead a call prenotata e' sotto il 10%. Questo suggerisce un problema nel nurturing o nel processo di prenotazione -- probabilmente stai perdendo lead caldi che non ricevono un follow-up tempestivo."
    );
  }
  if ((answers["conv_booking"] ?? 0) === 0) {
    findings.push(
      "Il processo di prenotazione call e' manuale. Ogni frizione in piu' riduce drasticamente il tasso di prenotazione -- un sistema automatizzato puo' fare una grande differenza."
    );
  }
  if ((answers["conv_followup"] ?? 0) === 0) {
    findings.push(
      "Non fai follow-up via email sui lead che non prenotano. Stai lasciando sul tavolo il 40-60% dei potenziali clienti che avevano bisogno solo di un promemoria."
    );
  }
  if ((answers["conv_tracking"] ?? 0) === 0) {
    findings.push(
      "Non tracki le conversioni da YouTube. Senza dati, e' impossibile sapere cosa funziona e cosa ottimizzare."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo processo di conversione e' solido, con lead magnet, prenotazione automatica e follow-up attivo."
    );
  }

  const tip =
    (answers["conv_followup"] ?? 0) === 0
      ? "Implementa un sistema di follow-up automatico (email + reminder) per i lead che non prenotano entro 48 ore dal primo contatto."
      : "Ottimizza il tuo funnel di conversione testando diverse offerte di lead magnet e monitora i tassi di conversione per ogni fase.";

  return { findings, tip };
}

// --- Main scoring function ---

export function calculateFunnelScore(
  youtube: YouTubeAnalysis,
  answers: QuizAnswers
): FunnelScore {
  // Attrazione combines YouTube data + quiz answers for attraction section
  const attrQuizScore = calcSectionScore("attrazione", answers);
  const attrYTScore = youtube.youtubeScore;
  // Blend: 60% YouTube data, 40% quiz answers
  const attrScore = Math.round(attrYTScore * 0.6 + attrQuizScore * 0.4);

  const fidScore = calcSectionScore("fidelizzazione", answers);
  const convScore = calcSectionScore("conversione", answers);

  const attr = attrazioneFindings(youtube, answers);
  const fid = fidelizzazioneFindings(answers);
  const conv = conversioneFindings(answers);

  const areas: AreaScore[] = [
    { area: "attrazione", label: "Attrazione", score: attrScore, findings: attr.findings, tip: attr.tip },
    { area: "fidelizzazione", label: "Fidelizzazione", score: fidScore, findings: fid.findings, tip: fid.tip },
    { area: "conversione", label: "Conversione", score: convScore, findings: conv.findings, tip: conv.tip },
  ];

  const totalScore = Math.round(
    attrScore * WEIGHTS.attrazione +
      fidScore * WEIGHTS.fidelizzazione +
      convScore * WEIGHTS.conversione
  );

  return { totalScore, areas };
}
