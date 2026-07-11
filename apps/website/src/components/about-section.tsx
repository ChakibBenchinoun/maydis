import { SectionLabel } from "@/components/section-label";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-secondary/45 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-secondary shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/gallery-03.jpg"
                alt="Maydi's café — brick walls, lush plants, warm natural light"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block w-36 h-36 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sealing.webp"
                alt="Maydi's seal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Our story</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">
              A bright corner
              <br />
              of Oran, made yours.
            </h2>
            <div className="w-10 h-0.5 bg-primary mt-5 mb-7" />
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
              Maydi&apos;s was born from a love of beautiful food and the belief that a café should feel
              like a warm hug. We imagined a space full of natural light, climbing plants, exposed
              brick, and the gentle clink of good coffee being made with care — and then we built it.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
              Every dish that leaves our kitchen is thoughtfully plated, seasonally inspired, and made
              entirely from scratch. We want you to sit here, slow down, and genuinely enjoy what&apos;s
              in front of you — whether that&apos;s a golden croissant on a Tuesday morning or a full
              brunch spread on a lazy Friday.
            </p>
            <p className="text-foreground font-semibold text-sm md:text-base leading-relaxed">
              Welcome to Maydi&apos;s. This place was made for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
