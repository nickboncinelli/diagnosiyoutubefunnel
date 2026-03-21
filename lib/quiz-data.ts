import { QuizQuestion } from "@/types";

export const quizQuestions: QuizQuestion[] = [
  // === SEZIONE A: Attrazione ===
  {
    id: "attr_cta",
    section: "attrazione",
    question: "Hai una call-to-action chiara nei tuoi video?",
    options: [
      { label: "Mai", value: 0 },
      { label: "Raramente", value: 25 },
      { label: "A volte", value: 50 },
      { label: "Sempre, con link in descrizione", value: 100 },
    ],
  },
  {
    id: "attr_seo_titles",
    section: "attrazione",
    question: "Ottimizzi i titoli dei tuoi video in ottica SEO (keyword research, lunghezza, chiarezza)?",
    options: [
      { label: "No, scrivo quello che mi viene", value: 0 },
      { label: "A volte uso qualche keyword", value: 33 },
      { label: "Faccio keyword research per ogni video", value: 75 },
      { label: "Ho un processo SEO strutturato (keyword + analisi competitor)", value: 100 },
    ],
  },
  {
    id: "attr_seo_descriptions",
    section: "attrazione",
    question: "Come gestisci le descrizioni dei tuoi video?",
    options: [
      { label: "Le lascio vuote o scrivo pochissimo", value: 0 },
      { label: "Scrivo qualche riga generica", value: 25 },
      { label: "Descrizione completa con link e keyword", value: 70 },
      { label: "Descrizione ottimizzata SEO + timestamp + link + CTA", value: 100 },
    ],
  },
  {
    id: "attr_thumbnails",
    section: "attrazione",
    question: "Come crei le thumbnail dei tuoi video?",
    options: [
      { label: "Uso quelle generate da YouTube", value: 0 },
      { label: "Le creo ma senza un metodo preciso", value: 30 },
      { label: "Design curato e coerente con il brand", value: 70 },
      { label: "A/B test delle thumbnail + analisi CTR", value: 100 },
    ],
  },
  {
    id: "attr_frequency",
    section: "attrazione",
    question: "Con che frequenza pubblichi video?",
    options: [
      { label: "Quando capita (nessuna costanza)", value: 0 },
      { label: "1-2 volte al mese", value: 30 },
      { label: "1 volta a settimana", value: 70 },
      { label: "2+ volte a settimana con piano editoriale", value: 100 },
    ],
  },

  // === SEZIONE B: Fidelizzazione ===
  {
    id: "fid_email_sequence",
    section: "fidelizzazione",
    question: "Hai una sequenza email automatica per i nuovi lead?",
    options: [
      { label: "No", value: 0 },
      { label: "Sì, 1-3 email", value: 33 },
      { label: "Sì, sequenza completa (5+ email)", value: 66 },
      { label: "Sì, segmentata per tipo di lead", value: 100 },
    ],
  },
  {
    id: "fid_retargeting",
    section: "fidelizzazione",
    question: "Fai retargeting sui visitatori del tuo funnel?",
    options: [
      { label: "No", value: 0 },
      { label: "Sì, su Facebook/Instagram", value: 40 },
      { label: "Sì, su YouTube", value: 60 },
      { label: "Sì, multi-piattaforma", value: 100 },
    ],
  },
  {
    id: "fid_community",
    section: "fidelizzazione",
    question: "Hai una community o un canale diretto con il tuo pubblico?",
    options: [
      { label: "No, solo i video YouTube", value: 0 },
      { label: "Rispondo ai commenti su YouTube", value: 25 },
      { label: "Ho un gruppo (Telegram, Facebook, Discord)", value: 65 },
      { label: "Community attiva + contenuti esclusivi per iscritti", value: 100 },
    ],
  },
  {
    id: "fid_segmentation",
    section: "fidelizzazione",
    question: "Come segmenti i tuoi lead?",
    options: [
      { label: "Non li segmento", value: 0 },
      { label: "Per fonte (YT, social, referral)", value: 33 },
      { label: "Per interesse/bisogno", value: 66 },
      { label: "Per stadio del buyer journey", value: 100 },
    ],
  },

  // === SEZIONE C: Conversione ===
  {
    id: "conv_lead_magnet",
    section: "conversione",
    question: "Che tipo di lead magnet offri?",
    options: [
      { label: "Nessuno", value: 0 },
      { label: "PDF / Guide", value: 40 },
      { label: "Webinar / Masterclass", value: 60 },
      { label: "Consulenza gratuita", value: 75 },
      { label: "Quiz, assessment o tool interattivo", value: 100 },
    ],
  },
  {
    id: "conv_rate",
    section: "conversione",
    question: "Qual e' il tuo tasso di conversione lead - call prenotata (stima)?",
    options: [
      { label: "Non lo so", value: 0 },
      { label: "Meno del 10%", value: 25 },
      { label: "10-25%", value: 50 },
      { label: "25-50%", value: 75 },
      { label: "Piu' del 50%", value: 100 },
    ],
  },
  {
    id: "conv_booking",
    section: "conversione",
    question: "Come prenoti le call di vendita?",
    options: [
      { label: "Scambio email/WhatsApp manuale", value: 0 },
      { label: "Calendly o simile", value: 66 },
      { label: "Sistema integrato nel CRM", value: 100 },
    ],
  },
  {
    id: "conv_followup",
    section: "conversione",
    question: "Fai follow-up via email sui lead che non prenotano?",
    options: [
      { label: "No", value: 0 },
      { label: "Sì, manualmente", value: 50 },
      { label: "Sì, con automazione email", value: 100 },
    ],
  },
  {
    id: "conv_tracking",
    section: "conversione",
    question: "Tracki le conversioni da YouTube ai tuoi lead?",
    options: [
      { label: "No", value: 0 },
      { label: "Parzialmente (UTM)", value: 50 },
      { label: "Sì, con dashboard dedicata", value: 100 },
    ],
  },
];

export const sectionLabels: Record<string, string> = {
  attrazione: "Attrazione",
  fidelizzazione: "Fidelizzazione",
  conversione: "Conversione",
};
