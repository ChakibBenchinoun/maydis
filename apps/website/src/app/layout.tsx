import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
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
      <body className="bg-background text-foreground min-h-screen overflow-x-hidden font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
