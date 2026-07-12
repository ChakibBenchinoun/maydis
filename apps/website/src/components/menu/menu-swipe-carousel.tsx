"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { MenuItem } from "@/data/menu";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

type MenuSwipeCarouselProps = {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
};

/**
 * Card swipe carousel for menu items — adapted from Skiper UI skiper48.
 * @see https://skiper-ui.com/v1/skiper48
 * Uses `motion/react` + Swiper EffectCards.
 *
 * Attribution: Skiper UI (free tier requires attribution).
 */
export function MenuSwipeCarousel({
  items,
  onSelect,
  className = "",
  autoplay = true,
  loop = true,
}: MenuSwipeCarouselProps) {
  const uid = useId().replace(/:/g, "");
  // EffectCards + loop needs many duplicates; use rewind for wrap-around instead
  // (avoids "not enough slides for loop mode" with short category lists).
  const wrapAround = loop && items.length > 1;

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        No dishes in this category yet.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mx-auto flex w-full justify-center ${className}`}
    >
      <style>{`
        .menu-swipe-carousel-${uid} {
          padding-bottom: 3rem !important;
          overflow: visible !important;
        }
        .menu-swipe-carousel-${uid} .swiper-slide {
          border-radius: 1.5rem;
          overflow: hidden;
          background: var(--card);
          border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
          box-shadow:
            0 16px 48px -12px rgba(44, 35, 24, 0.3),
            0 6px 16px -4px rgba(44, 35, 24, 0.12);
        }
        .menu-swipe-carousel-${uid} .swiper-pagination {
          bottom: 0 !important;
        }
        .menu-swipe-carousel-${uid} .swiper-pagination-bullet {
          background: var(--muted-foreground);
          opacity: 0.35;
          width: 9px;
          height: 9px;
          transition: opacity 0.2s, background 0.2s, transform 0.2s;
        }
        .menu-swipe-carousel-${uid} .swiper-pagination-bullet-active {
          background: var(--primary);
          opacity: 1;
          transform: scale(1.15);
        }
      `}</style>

      <div className="w-[min(100%,360px)] sm:w-[400px] md:w-[430px]">
        <Swiper
          key={items.map((i) => i.id).join("-")}
          effect="cards"
          grabCursor
          loop={false}
          rewind={wrapAround}
          spaceBetween={0}
          autoplay={
            autoplay
              ? {
                  delay: 3800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={{ clickable: true }}
          modules={[EffectCards, Autoplay, Pagination]}
          className={`menu-swipe-carousel-${uid} h-[560px] w-full sm:h-[600px] md:h-[620px]`}
          cardsEffect={{
            perSlideOffset: 10,
            perSlideRotate: 2,
            slideShadows: true,
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="group focus-visible:ring-primary relative flex h-full w-full flex-col text-left focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
              >
                <div className="bg-secondary relative min-h-0 flex-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  {item.tags[0] ? (
                    <span className="bg-primary/95 text-primary-foreground absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider uppercase shadow-sm">
                      {item.tags[0]}
                    </span>
                  ) : null}
                </div>

                <div className="bg-card shrink-0 px-5 pt-4 pb-5">
                  <h3 className="font-display text-foreground line-clamp-2 text-xl leading-snug font-bold">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-primary text-lg font-bold">{item.price}</span>
                    <span className="text-muted-foreground/70 group-hover:text-primary text-[11px] font-semibold tracking-wider uppercase transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  );
}
