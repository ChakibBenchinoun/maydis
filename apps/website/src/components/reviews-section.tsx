"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

import { reviews } from "@/data/reviews";
import { SectionLabel } from "@/components/section-label";
import { SectionDivider } from "@/components/section-divider";
import { StarRating } from "@/components/star-rating";

export function ReviewsSection() {
  return (
    <section className="py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>What our guests say</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Avis Clients
          </h2>
          <SectionDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
            >
              <Quote size={28} className="text-primary/20 mb-4" fill="currentColor" />
              <StarRating count={review.rating} />
              <p className="text-foreground/80 text-sm leading-relaxed mt-4 mb-6 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{review.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
