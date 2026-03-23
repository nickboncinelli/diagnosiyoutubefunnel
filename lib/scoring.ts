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

// --- Backstage YouTube video links for tips ---
const BACKSTAGE_VIDEOS = {
  titoli: "https://youtu.be/-fijJzqSds8?si=Awc4O5-4jQwLzTNn",
  thumbnail: "https://youtu.be/CVUd_0KVJ-s?si=q5-P3pW1EdEgs-8X",
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
      `Il tuo tasso di engagement (${m.engagementRate}%) e' sotto la media. Questo suggerisce che i tuoi contenuti non stanno colpendo nel segno del tuo pubblico target, oppure che titoli e copertine non attirano il click giusto.`
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

  // Quiz-based findings
  if ((answers["attr_valore"] ?? 0) <= 33) {
    findings.push(
      "I tuoi video non sembrano pensati per chi ti scopre per la prima volta. Ricorda: su YouTube la maggior parte delle views arriva da persone che non ti conoscono ancora."
    );
  }

  if ((answers["attr_thumbnails"] ?? 0) <= 30) {
    findings.push(
      `Le tue copertine non sono ottimizzate. Una copertina professionale e coerente col brand puo' migliorare il CTR del 2-3%, che su YouTube fa un'enorme differenza nel lungo periodo. Guarda questo video per approfondire: ${BACKSTAGE_VIDEOS.thumbnail}`
    );
  }

  if ((answers["attr_seo_titles"] ?? 0) <= 33) {
    findings.push(
      `I titoli dei tuoi video non sono ottimizzati in ottica SEO. Senza keyword research, i tuoi video non verranno trovati nella ricerca di YouTube. Approfondisci qui: ${BACKSTAGE_VIDEOS.titoli}`
    );
  }

  if ((answers["attr_script"] ?? 0) <= 15) {
    findings.push(
      "Stai delegando interamente lo script all'AI o improvvisando. Lo script e' il cuore del video: un buon script tiene lo spettatore incollato e lo porta alla CTA. L'AI puo' aiutare, ma la tua voce e la tua esperienza devono guidare il contenuto."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo canale ha metriche nella media. C'e' margine di miglioramento, soprattutto sulla costanza di pubblicazione e sull'engagement."
    );
  }

  const tip =
    m.seo.seoScore < 50
      ? `Priorita': ottimizza i titoli dei tuoi video con keyword research mirata. Guarda questo video per capire come fare: ${BACKSTAGE_VIDEOS.titoli}`
      : (answers["attr_thumbnails"] ?? 0) <= 30
        ? `Priorita': migliora le copertine dei tuoi video. Ecco come: ${BACKSTAGE_VIDEOS.thumbnail}`
        : m.publishingFrequency < 4
          ? "Aumenta la frequenza di pubblicazione ad almeno 1 video a settimana. La costanza e' il fattore numero uno per la crescita su YouTube."
          : "Concentrati sull'ottimizzare la retention dei video (hook nei primi 30 secondi) e sulle CTA per convertire viewer in lead.";

  return { findings, tip };
}

function fidelizzazioneFindings(answers: QuizAnswers): { findings: string[]; tip: string } {
  const findings: string[] = [];

  if ((answers["fid_correlati"] ?? 0) <= 33) {
    findings.push(
      "I tuoi video non seguono una logica tematica. Quando i contenuti sono troppo eterogenei, lo spettatore non ha motivo di guardare altri tuoi video. YouTube premia i canali che creano sessioni di visione lunghe."
    );
  }

  if ((answers["fid_linking"] ?? 0) <= 30) {
    findings.push(
      "Non stai indirizzando gli spettatori da un video all'altro. Schede, schermate finali e riferimenti vocali sono fondamentali per aumentare il watch time del canale e far entrare le persone nel tuo ecosistema."
    );
  }

  if ((answers["fid_editing"] ?? 0) === 0) {
    findings.push(
      "Fai tutto da solo con editing minimo. La qualita' dell'editing influisce direttamente sulla retention: tagli, grafiche e ritmo tengono lo spettatore attento. Valuta di investire in un editor."
    );
  }

  if ((answers["fid_descrizioni"] ?? 0) <= 25) {
    findings.push(
      "Le descrizioni dei tuoi video sono vuote o troppo brevi. Le descrizioni sono fondamentali per la SEO di YouTube e per indirizzare gli spettatori verso il tuo funnel (link, CTA, risorse)."
    );
  }

  if ((answers["fid_posizionamento"] ?? 0) <= 30) {
    findings.push(
      "Non comunichi in modo chiaro chi sei e perche' le persone dovrebbero seguirti. Il posizionamento e' cio' che trasforma uno spettatore casuale in un follower fedele. Rendilo esplicito in ogni video."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo sistema di fidelizzazione e' ben impostato: contenuti correlati, linking tra video e posizionamento chiaro. Ottimo lavoro!"
    );
  }

  const tip =
    (answers["fid_linking"] ?? 0) <= 30
      ? "Priorita': inizia a collegare i tuoi video tra loro. Aggiungi schede, schermate finali e menziona altri video pertinenti durante il contenuto. Questo aumenta il watch time e la fidelizzazione."
      : (answers["fid_posizionamento"] ?? 0) <= 30
        ? "Priorita': definisci e comunica il tuo posizionamento unico. Chi sei, cosa fai e perche' dovrebbero seguire te e non un altro. Inseriscilo nei primi 30 secondi di ogni video."
        : "Continua cosi'. Per il prossimo step, crea playlist tematiche che guidino lo spettatore in un percorso logico di apprendimento.";

  return { findings, tip };
}

function conversioneFindings(answers: QuizAnswers): { findings: string[]; tip: string } {
  const findings: string[] = [];

  if ((answers["conv_lead_magnet"] ?? 0) === 0) {
    findings.push(
      "Non hai un lead magnet collegato al tuo canale YouTube. Stai lasciando sul tavolo una percentuale significativa dei potenziali lead che guardano i tuoi video. Una newsletter, una guida PDF o un webinar gratuito possono fare la differenza."
    );
  }

  if ((answers["conv_cta"] ?? 0) <= 25) {
    findings.push(
      "Non inserisci CTA chiare nei tuoi video. Ogni video dovrebbe guidare lo spettatore verso il passo successivo: iscriversi alla newsletter, scaricare una guida, prenotare una call."
    );
  }

  if ((answers["conv_booking"] ?? 0) === 0) {
    findings.push(
      "Non dai la possibilita' di prenotare una call direttamente. Se il tuo business si basa su consulenze o servizi, un link di prenotazione in descrizione e' fondamentale per convertire gli spettatori interessati."
    );
  }

  if ((answers["conv_email_sequence"] ?? 0) === 0) {
    findings.push(
      "Non hai una sequenza email automatica. I lead che entrano nel tuo funnel ricevono zero touchpoint dopo il primo contatto — il follow-up manuale non scala. Implementa almeno una sequenza di benvenuto di 5 email."
    );
  }

  if ((answers["conv_tracking"] ?? 0) === 0) {
    findings.push(
      "Non tracci le conversioni da YouTube. Senza dati, e' impossibile sapere cosa funziona e cosa ottimizzare nel tuo funnel."
    );
  }

  if (!findings.length) {
    findings.push(
      "Il tuo processo di conversione e' solido: hai un lead magnet, CTA chiare, prenotazione automatica e sequenze email attive."
    );
  }

  const tip =
    (answers["conv_email_sequence"] ?? 0) === 0
      ? "Priorita': implementa una sequenza email di benvenuto di almeno 5 email che educhi il lead, costruisca fiducia e lo guidi verso la prenotazione di una call."
      : (answers["conv_lead_magnet"] ?? 0) === 0
        ? "Priorita': crea un lead magnet (newsletter, guida PDF, mini-corso) da promuovere nei tuoi video. E' il ponte tra 'spettatore' e 'contatto qualificato'."
        : "Ottimizza il tuo funnel di conversione testando diverse offerte e monitora i tassi di conversione per ogni fase con UTM e dashboard dedicate.";

  return { findings, tip };
}

// --- Main scoring function ---

export function calculateFunnelScore(
  youtube: YouTubeAnalysis,
  answers: QuizAnswers
): FunnelScore {
  // Attrazione combines YouTube data + quiz answers
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
