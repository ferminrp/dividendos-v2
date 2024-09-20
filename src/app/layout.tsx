import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from '@next/third-parties/google'
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react"
import { OpenPanelComponent } from '@openpanel/nextjs';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Próximos Dividendos | dividendos.xyz",
  description: "Información actualizada sobre próximos dividendos de acciones. Fechas de corte y pago para los próximos 7 días.",
  keywords: "dividendos, acciones, inversiones, bolsa, fecha de corte, fecha de pago",
  authors: [{ name: "ferminrp" }],
  openGraph: {
    type: "website",
    url: "https://dividendos.xyz",
    title: "Próximos Dividendos | dividendos.xyz",
    description: "Información actualizada sobre próximos dividendos de acciones. Fechas de corte y pago para los próximos 7 días.",
    images: [
      {
        url: "https://i.imgur.com/90DO3pe.png",
        secureUrl: "https://i.imgur.com/90DO3pe.png",
        type: "image/png",
        alt: "Próximos Dividendos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Próximos Dividendos | dividendos.xyz",
    description: "Información actualizada sobre próximos dividendos de acciones. Fechas de corte y pago para los próximos 7 días.",
    images: ["https://i.imgur.com/90DO3pe.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={geistSans.variable}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-BSLD4GPVWG" />
      <Analytics/>
      <OpenPanelComponent
        clientId="your-client-id"
        trackScreenViews={true}
      />
    </html>
  );
}
