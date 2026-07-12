import { SectionLabel } from "@/components/ui/section-label";

export function AboutSection() {
  return (
    <section id="about" className="bg-secondary/45 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="bg-secondary aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/gallery-03.jpg"
                alt="Maydi's café — brick walls, lush plants, warm natural light"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-background bg-secondary absolute -right-6 -bottom-6 hidden h-36 w-36 overflow-hidden rounded-2xl border-4 shadow-2xl md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sealing.webp"
                alt="Maydi's seal"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Our story</SectionLabel>
            <h2 className="font-display text-foreground mb-2 text-4xl leading-tight font-bold md:text-5xl">
              A bright corner
              <br />
              of Oran, made yours.
            </h2>
            <div className="bg-primary mt-5 mb-7 h-0.5 w-10" />
            <p className="text-muted-foreground mb-5 text-sm leading-relaxed md:text-base">
              Maydi&apos;s was born from a love of beautiful food and the belief that a café should
              feel like a warm hug. We imagined a space full of natural light, climbing plants,
              exposed brick, and the gentle clink of good coffee being made with care — and then we
              built it.
            </p>
            <p className="text-muted-foreground mb-5 text-sm leading-relaxed md:text-base">
              Every dish that leaves our kitchen is thoughtfully plated, seasonally inspired, and
              made entirely from scratch. We want you to sit here, slow down, and genuinely enjoy
              what&apos;s in front of you — whether that&apos;s a golden croissant on a Tuesday
              morning or a full brunch spread on a lazy Friday.
            </p>
            <p className="text-foreground text-sm leading-relaxed font-semibold md:text-base">
              Welcome to Maydi&apos;s. This place was made for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
