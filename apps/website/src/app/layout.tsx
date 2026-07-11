import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { site } from "@/lib/constants";
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
      <body className="min-h-screen antialiased bg-background text-foreground font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
