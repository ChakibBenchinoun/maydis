"use client";

import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

import {
  Container,
  Section,
  SectionDivider,
  sectionHeaderClass,
  SectionLabel,
} from "@/components/ui";
import { reviews } from "@/data/reviews";

export function ReviewsSection() {
  return (
    <Section id="reviews" tone="muted">
      <Container>
        <div className={sectionHeaderClass}>
          <SectionLabel>What our guests say</SectionLabel>
          <h2 className="font-display text-foreground text-4xl font-bold md:text-5xl">
            Avis Clients
          </h2>
          <SectionDivider />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card border-border/50 relative rounded-2xl border p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Quote size={28} className="text-primary/20 mb-4" fill="currentColor" />
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }).map((_, star) => (
                  <Star key={star} size={13} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground/80 mt-4 mb-6 text-sm leading-relaxed italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/15 flex h-9 w-9 items-center justify-center rounded-full">
                  <span className="text-primary text-sm font-bold">{review.name[0]}</span>
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
