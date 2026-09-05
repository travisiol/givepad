import type { Metadata } from "next";
import { Baloo_2, Montserrat } from "next/font/google";
import { CauseDefs } from "@/components/CauseTile";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PuffFilter } from "@/components/PuffFilter";
import { Sky } from "@/components/Sky";
import { site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-balloon",
  display: "swap",
});

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: site.xHandle,
    creator: site.xHandle,
    title,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${baloo.variable}`}>
      <body className="font-sans text-primary antialiased">
        <Sky />
        <PuffFilter />
        <CauseDefs />
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1 w-full mx-auto max-w-6xl px-4 sm:px-6 pt-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
