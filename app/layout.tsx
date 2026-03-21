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
  title: "YouTube Funnel Score | Backstage Agency",
  description:
    "Quanto vende il tuo funnel YouTube? Diagnosi completa del tuo canale + valutazione del tuo processo di acquisizione clienti. Scoprilo in 3 minuti.",
  openGraph: {
    title: "YouTube Funnel Score | Backstage Agency",
    description:
      "Diagnosi completa del tuo canale YouTube + valutazione del tuo funnel di vendita B2B.",
    type: "website",
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
