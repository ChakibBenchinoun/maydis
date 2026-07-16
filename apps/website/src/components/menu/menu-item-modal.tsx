"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import type { MenuItem } from "@/data/menu";

type MenuItemModalProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  return (
    <Lightbox open={Boolean(item)} onClose={onClose} label={item?.name} panelClassName="max-w-md">
      {item ? (
        <>
          <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
            aria-label="Close"
          >
            <X size={17} />
          </button>
          <div className="p-7">
            {item.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-accent/12 text-accent rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h3 className="font-display text-foreground mb-3 text-2xl leading-snug font-bold">
              {item.name}
            </h3>
            <p className="text-muted-foreground mb-7 text-sm leading-relaxed">{item.details}</p>
            <div className="flex items-center justify-between">
              <span className="text-primary text-2xl font-bold">{item.price}</span>
              <Button size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </Lightbox>
  );
}
