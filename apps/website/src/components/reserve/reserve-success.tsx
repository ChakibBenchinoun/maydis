"use client";

import { CheckCircle } from "lucide-react";

import { site } from "@/lib/constants";

export type WhatsAppStatus = {
  owner: boolean;
  guest: boolean;
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
  const waOk = whatsapp?.owner && whatsapp?.guest;
  const waPartial = whatsapp && (whatsapp.owner || whatsapp.guest) && !waOk;
  const isProd = process.env.NODE_ENV === "production";

  return (
    <div className="px-1 py-8 text-center sm:px-4 sm:py-10">
      <div className="bg-accent/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <CheckCircle className="text-accent h-8 w-8" />
      </div>
      <h3 className="font-display text-foreground mb-2 text-2xl font-bold">Request received</h3>
      <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
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
          <p>Guest confirmation: {whatsapp.guest ? "sent" : whatsapp.guestError || "not sent"}</p>
          {whatsapp.setupHint ? (
            <p className="text-foreground mt-2 font-medium">{whatsapp.setupHint}</p>
          ) : null}
        </div>
      )}

      <button
        type="button"
        onClick={onAgain}
        className="text-primary mt-6 text-sm font-medium hover:underline"
      >
        Make another request
      </button>
    </div>
  );
}
