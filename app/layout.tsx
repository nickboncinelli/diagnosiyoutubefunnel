import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diagnosi YouTube | Backstage Agency",
  description:
    "Scopri quanto vende il tuo funnel YouTube in 3 minuti. Diagnosi completa del tuo canale + consigli pratici per ottenere più clienti.",
  openGraph: {
    title: "Diagnosi YouTube | Backstage Agency",
    description:
      "Scopri quanto vende il tuo funnel YouTube in 3 minuti. Diagnosi completa + consigli pratici.",
    type: "website",
    siteName: "Backstage Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnosi YouTube | Backstage Agency",
    description:
      "Scopri quanto vende il tuo funnel YouTube in 3 minuti. Diagnosi completa + consigli pratici.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#050505", color: "#e6e6e6" }}>
        {children}
      </body>
    </html>
  );
}
