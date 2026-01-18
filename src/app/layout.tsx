
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

const font = Outfit({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    icons: {
      icon: '/favicon.png',
    },
  };
}

import MouseGradient from "@/components/MouseGradient";
import AnimatedStars from "@/components/AnimatedStars";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head />
      <body className={`${font.className} antialiased`}>
        <MouseGradient />
        <AnimatedStars />
        {settings.headerScripts && (
          <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.headerScripts }} />
        )}
        {children}
        {settings.footerScripts && (
          <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.footerScripts }} />
        )}
      </body>
    </html>
  );
}
