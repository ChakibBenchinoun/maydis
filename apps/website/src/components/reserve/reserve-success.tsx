"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Home, MessageCircle, Phone, UtensilsCrossed } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { menuLink, site } from "@/lib/constants";

export type WhatsAppStatus = {
  owner: boolean;
  guest: boolean;
  /** Server/dev diagnostics only — never render raw to guests. */
  ownerError?: string | null;
  guestError?: string | null;
  setupHint?: string | null;
};

export function ReserveSuccess({
  whatsapp,
  onAgain,
}: {
  whatsapp: WhatsAppStatus | null;
  onAgain: () => void;
}) {
  const waOk = Boolean(whatsapp?.owner && whatsapp?.guest);
  const waPartial = Boolean(whatsapp && (whatsapp.owner || whatsapp.guest) && !waOk);

  // Dev diagnostics: console only — never surface Baileys URLs / setup docs in the UI.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!whatsapp || waOk) return;
    console.warn("[reserve] WhatsApp notify (dev)", {
      owner: whatsapp.owner,
      guest: whatsapp.guest,
      ownerError: whatsapp.ownerError,
      guestError: whatsapp.guestError,
      setupHint: whatsapp.setupHint,
    });
  }, [whatsapp, waOk]);

  const nextStepCopy = waOk
    ? "We sent a WhatsApp confirmation to your number and alerted our team. We’ll follow up shortly."
    : waPartial
      ? "Your request is saved. We may still need to confirm by phone or WhatsApp — you’ll hear from us soon."
      : "Your request is saved. We’ll confirm by phone or WhatsApp shortly.";

  return (
    <div className="flex flex-col py-2">
      <div className="flex flex-1 flex-col text-center">
        <div className="bg-accent/15 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-accent h-8 w-8" />
        </div>

        <h1 className="font-display text-foreground mb-2 text-3xl font-bold sm:text-4xl">
          Request received
        </h1>
        <p className="text-foreground mx-auto mb-3 max-w-sm text-sm leading-relaxed font-medium">
          Thank you for choosing {site.name}. We cannot wait to host you in Oran.
        </p>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
          {nextStepCopy}
        </p>

        {/* Human contact — not technical status */}
        <div className="mx-auto mt-6 flex w-full max-w-sm flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a
            href={site.phoneHref}
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            <Phone size={14} strokeWidth={2.25} />
            Call {site.phone}
          </a>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            <MessageCircle size={14} strokeWidth={2.25} />
            WhatsApp
          </a>
        </div>

        <div className="border-border/50 mx-auto mt-8 w-full max-w-sm space-y-3 border-t pt-8 text-left">
          <p className="text-muted-foreground text-center text-xs font-semibold tracking-wider uppercase">
            While you wait
          </p>
          <Link
            href={menuLink.href}
            className={cn(
              buttonClassName({ variant: "primary", fullWidth: true }),
              "rounded-full tracking-normal normal-case",
            )}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Explore the menu
          </Link>
          <Link
            href="/"
            className={cn(
              buttonClassName({ variant: "outline", fullWidth: true }),
              "rounded-full tracking-normal normal-case",
            )}
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={onAgain}
            className="text-primary hover:text-primary/80 w-full cursor-pointer pt-1 text-center text-sm font-medium underline-offset-4 hover:underline"
          >
            Make another request
          </button>
        </div>
      </div>
    </div>
  );
}
