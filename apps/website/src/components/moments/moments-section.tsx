import { Play } from "lucide-react";

import { SectionDivider } from "@/components/ui/section-divider";
import { SectionLabel } from "@/components/ui/section-label";
import { momentVideos } from "@/lib/constants";

export function MomentsSection() {
  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <SectionLabel>Behind the scenes</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Our Moments
          </h2>
          <SectionDivider />
          <p className="text-muted-foreground mx-auto mt-5 max-w-xs text-sm leading-relaxed">
            A glimpse into the daily life of Maydi&apos;s — the kitchen, the space, the people.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {momentVideos.map((video) => (
            <div
              key={video.episode}
              className="group bg-foreground relative aspect-video cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.image}
                alt={video.alt}
                className="h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform duration-200 group-hover:scale-110">
                  <Play size={20} className="text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute right-0 bottom-0 left-0 p-5">
                <p className="mb-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase opacity-70">
                  {video.episode}
                </p>
                <p className="font-display text-lg leading-snug font-bold text-white">
                  {video.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
