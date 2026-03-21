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
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-accent/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
            </svg>
            Diagnosi gratuita in 3 minuti
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Quanto vende il tuo
            <br />
            <span className="text-accent">funnel YouTube?</span>
          </h1>

          <p className="text-lg md:text-xl text-gray max-w-xl mx-auto mb-10 leading-relaxed">
            Diagnosi completa del tuo canale + audit SEO + valutazione del tuo
            processo di acquisizione clienti. Scopri dove stai perdendo potenziali clienti.
          </p>

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
                Analizza il mio canale
              </Button>
            </div>
            {error && (
              <p className="text-danger text-sm mt-2 text-left">{error}</p>
            )}
          </form>

          <p className="text-xs text-gray/60 mt-4">
            Supporta: youtube.com/@handle, youtube.com/channel/..., youtube.com/c/...
          </p>

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
