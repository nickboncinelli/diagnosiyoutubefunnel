import { QuizQuestion } from "@/types";

export const quizQuestions: QuizQuestion[] = [
  // === SEZIONE A: Attrazione ===
  {
    id: "attr_valore",
    section: "attrazione",
    question: "I tuoi video hanno valore intrinseco anche per chi non ti conosce?",
    options: [
      { label: "No, sono pensati solo per chi mi segue già", value: 0 },
      { label: "Alcuni sì, ma non tutti", value: 33 },
      { label: "Sì, cerco sempre di dare valore a chiunque", value: 70 },
      { label: "Sì, ogni video è pensato per essere utile anche a chi mi scopre per la prima volta", value: 100 },
    ],
  },
  {
    id: "attr_thumbnails",
    section: "attrazione",
    question: "Come crei le copertine dei tuoi video?",
    options: [
      { label: "Uso quelle generate automaticamente da YouTube", value: 0 },
      { label: "Le creo ma senza un metodo preciso", value: 30 },
      { label: "Design curato e coerente con il brand", value: 70 },
      { label: "A/B test delle copertine + analisi CTR", value: 100 },
    ],
  },
  {
    id: "attr_seo_titles",
    section: "attrazione",
    question: "Ottimizzi i titoli dei tuoi video in ottica SEO?",
    options: [
      { label: "No, scrivo quello che mi viene", value: 0 },
      { label: "A volte uso qualche keyword", value: 33 },
      { label: "Faccio keyword research per ogni video", value: 75 },
      { label: "Ho un processo SEO strutturato (keyword + analisi competitor)", value: 100 },
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
  {
    id: "attr_script",
    section: "attrazione",
    question: "Ti impegni nella redazione dello script dei tuoi video?",
    options: [
      { label: "No, improvviso davanti alla camera", value: 0 },
      { label: "No, uso l'AI per tutto", value: 15 },
      { label: "Faccio una scaletta di massima", value: 50 },
      { label: "Scrivo uno script strutturato con hook, corpo e CTA", value: 100 },
    ],
  },

  // === SEZIONE B: Fidelizzazione ===
  {
    id: "fid_correlati",
    section: "fidelizzazione",
    question: "I tuoi video sono godibili uno dopo l'altro?",
    options: [
      { label: "No, i miei video sono molto eterogenei", value: 0 },
      { label: "Parzialmente, ma non c'è una logica precisa", value: 33 },
      { label: "Sì, cerco di creare una progressione tra i video", value: 70 },
      { label: "Sì, ho playlist tematiche e un percorso chiaro per lo spettatore", value: 100 },
    ],
  },
  {
    id: "fid_linking",
    section: "fidelizzazione",
    question: "Indirizzi sempre gli spettatori da un video all'altro quando possibile?",
    options: [
      { label: "Mai o quasi mai", value: 0 },
      { label: "A volte, quando mi ricordo", value: 30 },
      { label: "Spesso, uso schede e schermate finali", value: 70 },
      { label: "Sempre, con riferimenti vocali + schede + schermate finali + link in descrizione", value: 100 },
    ],
  },
  {
    id: "fid_editing",
    section: "fidelizzazione",
    question: "Hai un supporto di editing o fai tutto da solo?",
    options: [
      { label: "Faccio tutto da solo, editing minimo", value: 0 },
      { label: "Faccio tutto da solo ma curo l'editing", value: 40 },
      { label: "Ho un editor che mi aiuta", value: 75 },
      { label: "Ho un team dedicato (editor + grafica + post-produzione)", value: 100 },
    ],
  },
  {
    id: "fid_descrizioni",
    section: "fidelizzazione",
    question: "Curi bene le descrizioni dei tuoi video?",
    options: [
      { label: "Le lascio vuote o scrivo pochissimo", value: 0 },
      { label: "Scrivo qualche riga generica", value: 25 },
      { label: "Descrizione completa con link e keyword", value: 70 },
      { label: "Descrizione ottimizzata con timestamp, link, CTA e keyword", value: 100 },
    ],
  },
  {
    id: "fid_posizionamento",
    section: "fidelizzazione",
    question: "Spieghi sempre chi sei e qual è il valore unico di seguirti?",
    options: [
      { label: "No, do per scontato che le persone lo sappiano", value: 0 },
      { label: "Ogni tanto lo accenno", value: 30 },
      { label: "Sì, ho un'intro ricorrente che lo spiega", value: 70 },
      { label: "Sì, il mio posizionamento è chiaro in ogni video e nella pagina canale", value: 100 },
    ],
  },

  // === SEZIONE C: Conversione ===
  {
    id: "conv_lead_magnet",
    section: "conversione",
    question: "Hai un lead magnet per convertire gli spettatori in contatti?",
    options: [
      { label: "Nessuno", value: 0 },
      { label: "Newsletter", value: 50 },
      { label: "PDF / Guida scaricabile", value: 60 },
      { label: "Webinar / Masterclass gratuita", value: 75 },
      { label: "Quiz, assessment o tool interattivo", value: 100 },
    ],
  },
  {
    id: "conv_cta",
    section: "conversione",
    question: "Inserisci sempre una CTA chiara all'interno dei tuoi video?",
    options: [
      { label: "Mai", value: 0 },
      { label: "Raramente", value: 25 },
      { label: "A volte", value: 50 },
      { label: "Sempre, con link in descrizione", value: 100 },
    ],
  },
  {
    id: "conv_booking",
    section: "conversione",
    question: "Dai la possibilità agli spettatori di prenotare una call?",
    options: [
      { label: "No", value: 0 },
      { label: "Solo su richiesta via email/DM", value: 25 },
      { label: "Sì, ho un link Calendly o simile in descrizione", value: 70 },
      { label: "Sì, sistema integrato con CRM e automazioni", value: 100 },
    ],
  },
  {
    id: "conv_email_sequence",
    section: "conversione",
    question: "Hai una sequenza email automatica per i nuovi lead?",
    options: [
      { label: "No", value: 0 },
      { label: "Sì, 1-3 email", value: 33 },
      { label: "Sì, sequenza completa (5+ email)", value: 66 },
      { label: "Sì, segmentata per tipo di lead", value: 100 },
    ],
  },
  {
    id: "conv_tracking",
    section: "conversione",
    question: "Tracci le conversioni che arrivano da YouTube?",
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
