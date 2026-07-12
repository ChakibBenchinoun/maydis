"use client";

import { useState } from "react";

import { MenuItemModal } from "@/components/menu/menu-item-modal";
import { MenuScrollRow } from "@/components/menu/menu-scroll-row";
import { MenuSwipeCarousel } from "@/components/menu/menu-swipe-carousel";
import {
  Container,
  Heading,
  Link,
  Paragraph,
  Section,
  SectionDivider,
  sectionHeaderClass,
  SectionLabel,
} from "@/components/ui";
import type { MenuItem } from "@/data/menu";
import { latestMenuCopy } from "@/lib/constants";

type LatestMenuSectionProps = {
  /** Pre-selected “latest” dishes (from `pickLatestMenuItems`) */
  items: MenuItem[];
};

/**
 * Home section: latest dishes only.
 * Header + CTA stay in Container; cards run full-bleed (like gallery).
 */
export function LatestMenuSection({ items }: LatestMenuSectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const hasItems = items.length > 0;

  return (
    <>
      <Section id="menu" className="overflow-x-hidden">
        <Container>
          <div className={sectionHeaderClass}>
            <SectionLabel>{latestMenuCopy.label}</SectionLabel>
            <Heading>{latestMenuCopy.title}</Heading>
            <SectionDivider />
            <Paragraph size="sm" className="mx-auto mt-5 max-w-sm">
              {latestMenuCopy.description}
            </Paragraph>
          </div>
        </Container>

        {hasItems ? (
          <div className="w-full overflow-hidden">
            <div className="lg:hidden">
              <MenuSwipeCarousel items={items} onSelect={setSelectedItem} className="mb-2" />
            </div>
            <div className="hidden lg:block">
              <MenuScrollRow items={items} categoryKey="latest" onSelect={setSelectedItem} />
            </div>
          </div>
        ) : (
          <Container>
            <Paragraph size="sm" className="py-8 text-center">
              {latestMenuCopy.empty}
            </Paragraph>
          </Container>
        )}

        <Container>
          <div className="mt-10 text-center md:mt-12">
            <Link href={latestMenuCopy.ctaHref} variant="primary">
              {latestMenuCopy.cta}
            </Link>
          </div>
        </Container>
      </Section>

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
