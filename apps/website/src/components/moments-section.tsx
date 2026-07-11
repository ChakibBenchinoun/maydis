import { Play } from "lucide-react";

import { momentVideos } from "@/lib/constants";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";

export function MomentsSection() {
  return (
    <section className="py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Behind the scenes</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Our Moments
          </h2>
          <SectionDivider />
          <p className="text-muted-foreground text-sm mt-5 max-w-xs mx-auto leading-relaxed">
            A glimpse into the daily life of Maydi&apos;s — the kitchen, the space, the people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {momentVideos.map((video) => (
            <div
              key={video.episode}
              className="group rounded-2xl overflow-hidden bg-foreground shadow-md hover:shadow-xl transition-shadow duration-300 aspect-video relative cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.image}
                alt={video.alt}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                  <Play size={20} className="text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-70">
                  {video.episode}
                </p>
                <p className="text-white font-display font-bold text-lg leading-snug">
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
