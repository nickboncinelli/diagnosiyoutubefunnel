"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import ScoreBadge from "@/components/ui/ScoreBadge";
import { quizQuestions, sectionLabels } from "@/lib/quiz-data";
import { YouTubeAnalysis, QuizAnswers, LeadInfo, FunnelScore } from "@/types";

// Flow: analyzing → preview → quiz → lead_capture → calculating → results
type Step = "analyzing" | "preview" | "quiz" | "lead_capture" | "calculating";

const loadingMessages = [
  "Sto analizzando il tuo canale...",
  "Scarico i dati degli ultimi video...",
  "Analizzo la SEO dei titoli e descrizioni...",
  "Calcolo le metriche di performance...",
  "Verifico la frequenza di pubblicazione...",
  "Quasi fatto...",
];

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const channelUrl = searchParams.get("channel") || "";

  const [step, setStep] = useState<Step>("analyzing");
  const [youtube, setYouTube] = useState<YouTubeAnalysis | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [lead, setLead] = useState<LeadInfo>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    privacyAccepted: false,
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const analyzeStartTime = useRef<number>(0);

  const analyzeChannel = useCallback(async () => {
    if (!channelUrl) {
      setError("URL del canale mancante");
      return;
    }

    analyzeStartTime.current = Date.now();

    try {
      const res = await fetch("/api/youtube/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: channelUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore durante la diagnosi");
      }

      // Ensure minimum 8 seconds of loading for perceived thoroughness
      const elapsed = Date.now() - analyzeStartTime.current;
      const minDelay = 8000;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      setYouTube(data);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la diagnosi del canale");
    }
  }, [channelUrl]);

  useEffect(() => {
    if (step === "analyzing") {
      analyzeChannel();
    }
  }, [step, analyzeChannel]);

  useEffect(() => {
    if (step !== "analyzing") return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  const currentSection = quizQuestions[currentQ]?.section;
  const prevSection = currentQ > 0 ? quizQuestions[currentQ - 1]?.section : null;
  const showSectionHeader = currentSection !== prevSection;

  const handleAnswer = (questionId: string, value: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ((i) => i + 1);
      } else {
        // Quiz finished → go to lead capture
        setStep("lead_capture");
      }
    }, 300);
  };

  const validateLead = (): boolean => {
    const errors: Record<string, string> = {};
    if (!lead.fullName.trim()) errors.fullName = "Nome richiesto";
    if (!lead.email.trim()) errors.email = "Email richiesta";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email))
      errors.email = "Email non valida";
    if (!lead.role) errors.role = "Seleziona un ruolo";
    if (!lead.privacyAccepted) errors.privacy = "Devi accettare la privacy policy";
    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLead()) {
      // After lead capture, calculate score
      handleComplete(quizAnswers);
    }
  };

  const handleComplete = async (finalAnswers: QuizAnswers) => {
    setStep("calculating");
    setSubmitting(true);

    const calcStart = Date.now();

    try {
      const res = await fetch("/api/score/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtube,
          quizAnswers: finalAnswers,
          lead,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Errore nel calcolo");

      const result = {
        id: data.id,
        createdAt: new Date().toISOString(),
        lead,
        youtube,
        quizAnswers: finalAnswers,
        score: data.score as FunnelScore,
      };

      // Send email in background
      fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      }).catch(console.error);

      // GHL CRM integration now handled server-side in /api/score/calculate

      // Store data in sessionStorage to avoid URL too long (HTTP 431)
      sessionStorage.setItem(`result-${data.id}`, JSON.stringify(result));

      // Ensure minimum 10 seconds of "calculating" for perceived depth
      const elapsed = Date.now() - calcStart;
      const minDelay = 10000;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel calcolo del punteggio");
      setStep("quiz");
      setSubmitting(false);
    }
  };

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Ops! Qualcosa non ha funzionato</h2>
          <p className="text-gray mb-6">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Torna alla home
          </Button>
        </div>
      </div>
    );
  }

  // --- ANALYZING STATE ---
  if (step === "analyzing") {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-2 tracking-tight">
            Diagnosi
          </h1>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4 tracking-tight">
            in corso
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mb-10" />

          <div className="bg-card border border-border rounded-2xl p-8 text-left mb-8">
            <p className="text-base font-bold text-center mb-6">
              Stiamo analizzando il tuo canale e verificando oltre 15 criteri di performance e conversione.
            </p>

            <p className="text-sm mb-4">
              <span className="font-bold">Entro 3 minuti</span> scoprirai:
            </p>

            <div className="space-y-3 mb-6">
              {[
                "Il punteggio del tuo funnel (da 0 a 100)",
                "Punti di forza da sfruttare e problemi da risolvere",
                "Audit SEO dei tuoi titoli e descrizioni",
                "Azioni concrete da applicare subito",
                "Dove stai perdendo potenziali clienti",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" fill="#FF0000" opacity="0.15" />
                    <path d="M8 12l2.5 2.5L16 9" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray text-sm mb-3">{loadingMessages[loadingMsgIndex]}</p>
          <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-accent rounded-full animate-pulse-slow" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  // --- PREVIEW STATE ---
  if (step === "preview" && youtube) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-card border border-border rounded-2xl p-8">
            {/* Channel info */}
            <div className="flex items-center gap-4 mb-6">
              {youtube.channel.thumbnailUrl && (
                <img
                  src={youtube.channel.thumbnailUrl}
                  alt={youtube.channel.title}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{youtube.channel.title}</h2>
                <p className="text-sm text-gray">
                  {youtube.channel.customUrl || `@${youtube.channel.title}`}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">
                  {youtube.channel.subscriberCount.toLocaleString("it-IT")}
                </div>
                <div className="text-xs text-gray">Iscritti</div>
              </div>
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">
                  {youtube.channel.videoCount.toLocaleString("it-IT")}
                </div>
                <div className="text-xs text-gray">Video</div>
              </div>
              <div className="text-center p-3 bg-gray-light rounded-xl border border-border">
                <div className="text-lg font-bold">
                  {youtube.channel.viewCount.toLocaleString("it-IT")}
                </div>
                <div className="text-xs text-gray">Views totali</div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray mb-2">Score Canale</p>
                <ScoreBadge score={youtube.youtubeScore} size="sm" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray mb-2">SEO Score</p>
                <ScoreBadge score={youtube.metrics.seo.seoScore} size="sm" />
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-center">
                Abbiamo trovato <strong>diverse aree di miglioramento</strong> sul tuo canale.
                Completa la diagnosi del funnel per scoprire il quadro completo.
              </p>
            </div>

            <Button
              onClick={() => setStep("quiz")}
              className="w-full"
              size="lg"
            >
              Continua con la diagnosi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ ---
  if (step === "quiz") {
    const question = quizQuestions[currentQ];

    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
          <ProgressBar current={currentQ + 1} total={quizQuestions.length} />

          <div className="flex-1 flex flex-col justify-center py-8">
            {showSectionHeader && (
              <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                {sectionLabels[question.section]}
              </div>
            )}

            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-snug">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = quizAnswers[question.id] === option.value;
                return (
                  <button
                    key={option.label}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border hover:border-accent/50 text-foreground/80"
                    }`}
                  >
                    <span className="text-base">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ((i) => i - 1)}
              className="text-sm text-gray hover:text-foreground transition-colors cursor-pointer"
            >
              Domanda precedente
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- LEAD CAPTURE (after quiz, before results) ---
  if (step === "lead_capture") {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Ci siamo quasi!
            </h2>
            <p className="text-gray">
              Per ricevere la diagnosi completa e il report
              dettagliato via email, inserisci i tuoi dati.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Nome e cognome *
              </label>
              <input
                id="fullName"
                type="text"
                value={lead.fullName}
                onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors text-foreground"
                placeholder="Mario Rossi"
              />
              {leadErrors.fullName && (
                <p className="text-danger text-xs mt-1">{leadErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors text-foreground"
                placeholder="mario@azienda.it"
              />
              {leadErrors.email && (
                <p className="text-danger text-xs mt-1">{leadErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Telefono <span className="text-gray text-xs">(opzionale)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors text-foreground"
                placeholder="+39 333 1234567"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Azienda / Attivita&apos; <span className="text-gray text-xs">(opzionale)</span>
              </label>
              <input
                id="company"
                type="text"
                value={lead.company}
                onChange={(e) => setLead({ ...lead, company: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors text-foreground"
                placeholder="Nome azienda"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Ruolo *
              </label>
              <select
                id="role"
                value={lead.role}
                onChange={(e) => setLead({ ...lead, role: e.target.value })}
                className="w-full px-4 py-3 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors appearance-none cursor-pointer text-foreground"
              >
                <option value="">Seleziona il tuo ruolo</option>
                <option value="Imprenditore">Imprenditore</option>
                <option value="Consulente">Consulente</option>
                <option value="Coach">Coach</option>
                <option value="Formatore">Formatore</option>
                <option value="Agenzia">Agenzia</option>
                <option value="Altro">Altro</option>
              </select>
              {leadErrors.role && (
                <p className="text-danger text-xs mt-1">{leadErrors.role}</p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="privacy"
                checked={lead.privacyAccepted}
                onChange={(e) =>
                  setLead({ ...lead, privacyAccepted: e.target.checked })
                }
                className="mt-1 w-4 h-4 accent-accent cursor-pointer"
              />
              <label htmlFor="privacy" className="text-sm text-gray cursor-pointer">
                Accetto la{" "}
                <a href="#" className="text-accent underline">
                  privacy policy
                </a>{" "}
                e acconsento al trattamento dei miei dati per ricevere il report.
              </label>
            </div>
            {leadErrors.privacy && (
              <p className="text-danger text-xs">{leadErrors.privacy}</p>
            )}

            <Button type="submit" className="w-full" size="lg">
              Ricevi la diagnosi completa
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // --- CALCULATING (with 10s minimum delay) ---
  if (step === "calculating") {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-2 tracking-tight">
            Diagnosi
          </h1>
          <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-4 tracking-tight">
            in corso
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mb-10" />

          <div className="bg-card border border-border rounded-2xl p-8 text-left">
            <p className="text-base font-bold text-center mb-6">
              Stiamo calcolando il punteggio del tuo funnel e generando il report personalizzato.
            </p>

            <p className="text-sm mb-4">
              <span className="font-bold">Entro pochi secondi</span> scoprirai:
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Il punteggio totale del tuo funnel YouTube",
                "Il dettaglio per Attrazione, Fidelizzazione e Conversione",
                "I problemi principali e come risolverli",
                "Azioni pratiche da implementare subito",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" fill="#FF0000" opacity="0.15" />
                    <path d="M8 12l2.5 2.5L16 9" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>

            {/* Email confirmation */}
            {lead.email && (
              <div className="bg-foreground/5 rounded-xl p-4 flex items-center gap-3">
                <span className="text-lg">&#9993;</span>
                <div>
                  <p className="text-xs text-gray">Il report PDF sarà inviato a:</p>
                  <p className="text-sm font-bold">{lead.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-accent rounded-full animate-pulse-slow" style={{ width: "80%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function QuizPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray">Caricamento...</p>
          </div>
        }
      >
        <QuizContent />
      </Suspense>
    </main>
  );
}
