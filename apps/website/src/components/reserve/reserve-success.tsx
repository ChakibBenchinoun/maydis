"use client";

import { CheckCircle, Home, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { menuLink, site } from "@/lib/constants";

export type WhatsAppStatus = {
  owner: boolean;
  guest: boolean;
  ownerError?: string | null;
  guestError?: string | null;
  setupHint?: string | null;
};

/** Match form step body so the card does not collapse on success. */
const SUCCESS_MIN_H = "min-h-[28rem] sm:min-h-[30rem]";

export function ReserveSuccess({
  whatsapp,
  onAgain,
}: {
  whatsapp: WhatsAppStatus | null;
  onAgain: () => void;
}) {
  const waOk = whatsapp?.owner && whatsapp?.guest;
  const waPartial = whatsapp && (whatsapp.owner || whatsapp.guest) && !waOk;
  const isProd = process.env.NODE_ENV === "production";

  return (
    <div className={cn(SUCCESS_MIN_H, "flex flex-col px-1 py-6 sm:px-2 sm:py-8")}>
      <div className="flex flex-1 flex-col text-center">
        <div className="bg-accent/15 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-accent h-8 w-8" />
        </div>

        <h3 className="font-display text-foreground mb-2 text-2xl font-bold sm:text-3xl">
          Request received
        </h3>
        <p className="text-foreground mx-auto mb-3 max-w-sm text-sm font-medium leading-relaxed">
          Thank you for choosing {site.name}. We cannot wait to host you in Oran.
        </p>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
          {waOk
            ? "WhatsApp confirmation was sent to your number, and our team got a booking alert. We'll follow up shortly."
            : waPartial
              ? "Your request was saved. Some WhatsApp messages could not be delivered — we'll still reach out."
              : "Your request was saved. We'll confirm by phone or WhatsApp shortly."}{" "}
          Call{" "}
          <a href={site.phoneHref} className="text-primary font-semibold hover:underline">
            {site.phone}
          </a>{" "}
          if urgent.
        </p>

        {whatsapp && !waOk && !isProd && (
          <div className="border-border/60 bg-secondary/80 text-muted-foreground mx-auto mt-5 max-w-sm rounded-xl border px-4 py-3 text-left text-xs leading-relaxed">
            <p className="text-foreground mb-1.5 font-semibold">WhatsApp status (dev)</p>
            <p>Owner alert: {whatsapp.owner ? "sent" : whatsapp.ownerError || "not sent"}</p>
            <p>
              Guest confirmation:{" "}
              {whatsapp.guest ? "sent" : whatsapp.guestError || "not sent"}
            </p>
            {whatsapp.setupHint ? (
              <p className="text-foreground mt-2 font-medium">{whatsapp.setupHint}</p>
            ) : null}
          </div>
        )}

        <div className="border-border/50 mx-auto mt-8 w-full max-w-sm space-y-3 border-t pt-8 text-left">
          <p className="text-muted-foreground text-center text-xs font-semibold tracking-wider uppercase">
            While you wait
          </p>
          <Link
            href={menuLink.href}
            className={cn(
              buttonClassName({ variant: "primary", fullWidth: true }),
              "rounded-lg normal-case tracking-normal",
            )}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Explore the menu
          </Link>
          <Link
            href="/"
            className={cn(
              buttonClassName({ variant: "outline", fullWidth: true }),
              "rounded-lg normal-case tracking-normal",
            )}
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={onAgain}
            className="text-primary hover:text-primary/80 w-full pt-1 text-center text-sm font-medium underline-offset-4 hover:underline"
          >
            Make another request
          </button>
        </div>
      </div>
    </div>
  );
}
