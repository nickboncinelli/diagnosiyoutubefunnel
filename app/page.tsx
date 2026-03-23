"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import BackstageLogo from "@/components/ui/BackstageLogo";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Inserisci l'URL del tuo canale YouTube");
      return;
    }

    const isValid =
      trimmed.includes("youtube.com/") ||
      trimmed.includes("youtu.be/") ||
      trimmed.startsWith("@");

    if (!isValid) {
      setError("Inserisci un URL YouTube valido (es. youtube.com/@tuocanale)");
      return;
    }

    router.push(`/quiz?channel=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BackstageLogo size="md" />
          <a
            href="https://backstagelab.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray hover:text-accent transition-colors"
          >
            backstagelab.co
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 tracking-tight">
            Quanto vende il tuo
            <br />
            <span className="text-accent">funnel YouTube?</span>
          </h1>

          <p className="text-lg md:text-xl text-gray max-w-xl mx-auto mb-12 leading-relaxed">
            Ricevi una diagnosi completa del tuo canale con problemi, punti di forza e consigli pratici pronti da applicare.
          </p>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-3">1</div>
              <p className="text-sm leading-snug">
                Incolla il link del tuo canale YouTube
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-3">2</div>
              <p className="text-sm leading-snug">
                Ricevi la diagnosi con consigli pratici via email
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-accent mb-3">3</div>
              <p className="text-sm leading-snug">
                Applica i consigli e ottieni più clienti
              </p>
            </div>
          </div>

          {/* URL Input */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"
                      fill="#FF0000"
                    />
                    <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                  }}
                  placeholder="youtube.com/@tuocanale"
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border focus:border-accent rounded-xl text-base outline-none transition-colors placeholder:text-gray/60 text-foreground"
                  aria-label="URL del canale YouTube"
                />
              </div>
              <Button type="submit" size="lg">
                Inizia la diagnosi
              </Button>
            </div>
            {error && (
              <p className="text-danger text-sm mt-2 text-left">{error}</p>
            )}
          </form>

          <p className="text-xs text-gray/60 mt-4">
            Supporta: youtube.com/@handle, youtube.com/channel/..., youtube.com/c/...
          </p>

          {/* What you'll discover */}
          <div className="mt-16 max-w-lg mx-auto text-left">
            <h3 className="text-lg font-bold mb-4 text-center">
              <span className="text-accent">Entro 3 minuti</span> scoprirai:
            </h3>
            <div className="space-y-3">
              {[
                "Il punteggio del tuo funnel YouTube (da 0 a 100)",
                "Quanto è ottimizzata la SEO dei tuoi video",
                "Azioni concrete da applicare già dal prossimo video",
                "Dove stai perdendo potenziali clienti nel tuo processo",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" fill="#FF0000" opacity="0.15" />
                    <path
                      d="M8 12l2.5 2.5L16 9"
                      stroke="#FF0000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground/70">500+</div>
              <div className="text-xs mt-1">Canali analizzati</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground/70">3 min</div>
              <div className="text-xs mt-1">Tempo medio</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground/70">100%</div>
              <div className="text-xs mt-1">Gratuito</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-sm text-gray/50 border-t border-border">
        <p>&copy; {new Date().getFullYear()} Backstage Agency — backstagelab.co</p>
      </footer>
    </main>
  );
}
