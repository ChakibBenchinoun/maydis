import type { Metadata } from "next";

import { site } from "@/lib/constants";
import { fontDisplay, fontSans } from "@/lib/fonts";

import "@/styles/index.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Café in Oran`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      {/*
        Prefer overflow-x-clip over hidden: WebKit disables CSS/JS smooth scroll when
        the scrolling root has overflow-x: hidden. Clip still blocks horizontal bleed.
      */}
      <body className="bg-background text-foreground min-h-screen overflow-x-clip font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
