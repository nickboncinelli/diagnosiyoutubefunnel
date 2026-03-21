import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY non configurata");
  return new Resend(key);
}

export async function sendReportEmail({
  to,
  name,
  score,
  resultUrl,
  pdfBuffer,
}: {
  to: string;
  name: string;
  score: number;
  resultUrl: string;
  pdfBuffer: Buffer;
}) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "analisi@backstagelab.co";
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendar.app.google/JxzkkrfE9wwLYSgb8";

  const firstName = name.split(" ")[0];

  await getResend().emails.send({
    from: `Backstage Agency <${fromEmail}>`,
    to,
    subject: `Il tuo YouTube Funnel Score: ${score}/100 — Report completo`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #e6e6e6; background-color: #050505;">

        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #222;">
          <h1 style="font-size: 22px; color: #e6e6e6; margin: 0; font-weight: 600; letter-spacing: 0.05em;">backstage</h1>
          <p style="color: #888; margin-top: 4px; font-size: 13px;">YouTube Growth Partner</p>
        </div>

        <p style="font-size: 16px; color: #e6e6e6; line-height: 1.7;">
          Ciao ${firstName},
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          in allegato trovi il tuo <strong style="color: #e6e6e6;">YouTube Funnel Score</strong>. Leggilo con attenzione: e' l'analisi piu' approfondita e diretta che probabilmente hai mai ricevuto sul tuo canale YouTube e sul tuo processo di acquisizione clienti.
        </p>

        <div style="text-align: center; margin: 32px 0; padding: 24px; background: #0e0e0e; border-radius: 12px; border: 1px solid #222;">
          <div style="font-size: 48px; font-weight: 700; color: ${score >= 70 ? '#22C55E' : score >= 40 ? '#EAB308' : '#EF4444'};">
            ${score}/100
          </div>
          <p style="color: #888; margin-top: 8px; margin-bottom: 0; font-size: 14px;">Il tuo punteggio complessivo</p>
        </div>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Quello che hai tra le mani non e' un documento generico: e' un'analisi costruita sui dati reali del tuo canale — SEO dei titoli, ottimizzazione delle descrizioni, engagement, frequenza di pubblicazione, e l'intero funnel di conversione.
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Troverai criticita' specifiche da correggere e indicazioni precise su dove stai lasciando opportunita' sul tavolo. La situazione attuale ha margini importanti di miglioramento — ma tutto e' gia' scritto nero su bianco nel report.
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Puoi anche <a href="${resultUrl}" style="color: #FF0000; text-decoration: underline;">rivedere i risultati online</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />

        <p style="font-size: 16px; color: #e6e6e6; line-height: 1.7; font-weight: 600;">
          La diagnosi completa e' un punto di partenza solido. Ma il vero valore emerge quando ci mettiamo la testa sopra insieme.
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Lavoriamo sulla crescita YouTube di professionisti B2B da anni — non solo sui singoli video, ma sull'intero sistema: canale, contenuti, SEO, funnel, lead generation e processo di vendita.
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Se vuoi capire esattamente dove intervenire nel tuo caso specifico e uscire con un piano d'azione concreto, <strong style="color: #e6e6e6;">prenota una consulenza gratuita</strong>.
        </p>

        <p style="font-size: 16px; color: #ccc; line-height: 1.7;">
          Analizziamo insieme la tua situazione con i dati di YouTube Analytics (watch time, retention, CTR, sorgenti di traffico), identifichiamo i punti prioritari e definiamo i prossimi passi — senza giri di parole.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${calendarUrl}"
             style="display: inline-block; padding: 16px 32px; background: #FF0000; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Prenota la tua call gratuita
          </a>
          <p style="color: #666; font-size: 13px; margin-top: 8px;">Piano d'azione concreto incluso</p>
        </div>

        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />

        <p style="font-size: 14px; color: #888; text-align: center; line-height: 1.6;">
          <a href="https://backstagelab.co" style="color: #888;">Backstage Agency</a> — Aiutiamo professionisti B2B a trasformare YouTube in una macchina di acquisizione clienti.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `YouTube-Funnel-Score-${score}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
