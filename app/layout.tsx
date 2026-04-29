import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-TBK762J9";
const GADS_ID = "AW-18006685293";

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Backstage Agency Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Diagnosi YouTube | Backstage Agency",
    description:
      "Scopri quanto vende il tuo funnel YouTube in 3 minuti. Diagnosi completa + consigli pratici.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <head>
        {/* gtag definition — runs synchronously so gtag() is always available */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GADS_ID}');`,
          }}
        />
        {/* Load gtag.js and GTM async */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#050505", color: "#e6e6e6" }}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
