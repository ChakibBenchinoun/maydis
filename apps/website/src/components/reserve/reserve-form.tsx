"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "lucide-react";

import { site } from "@/lib/constants";

const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "10", "12+"];
const timeOptions = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const fieldClass =
  "w-full px-3.5 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

type FormState = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "12:00",
  guests: "2",
  notes: "",
};

type WhatsAppStatus = {
  owner: boolean;
  guest: boolean;
  ownerError?: string | null;
  guestError?: string | null;
  setupHint?: string | null;
};

export function ReserveForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<WhatsAppStatus | null>(null);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setWhatsapp(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        whatsapp?: WhatsAppStatus;
      };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again or call us.");
      }
      setWhatsapp(data.whatsapp ?? null);
      setSent(true);
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    const waOk = whatsapp?.owner && whatsapp?.guest;
    const waPartial = whatsapp && (whatsapp.owner || whatsapp.guest) && !waOk;

    return (
      <div className="px-4 py-10 text-center">
        <div className="bg-accent/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-accent h-8 w-8" />
        </div>
        <h3 className="font-display text-foreground mb-2 text-2xl font-bold">Request received</h3>
        <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
          {waOk
            ? "WhatsApp confirmation was sent to your number, and our team got a booking alert. We'll follow up shortly."
            : waPartial
              ? "Your request was saved. Some WhatsApp messages could not be delivered — see details below."
              : "Your request was saved. WhatsApp alerts need the free bot running (see below), or call us for same-day plans."}{" "}
          Call{" "}
          <a href={site.phoneHref} className="text-primary font-semibold hover:underline">
            {site.phone}
          </a>{" "}
          if urgent.
        </p>

        {whatsapp && !waOk && (
          <div className="border-border/60 bg-secondary/80 text-muted-foreground mx-auto mt-5 max-w-sm rounded-xl border px-4 py-3 text-left text-xs leading-relaxed">
            <p className="text-foreground mb-1.5 font-semibold">WhatsApp status</p>
            <p>Owner alert: {whatsapp.owner ? "sent" : whatsapp.ownerError || "not sent"}</p>
            <p>Guest confirmation: {whatsapp.guest ? "sent" : whatsapp.guestError || "not sent"}</p>
            {whatsapp.setupHint ? (
              <p className="text-foreground mt-2 font-medium">{whatsapp.setupHint}</p>
            ) : null}
            <p className="mt-2">
              Dev setup: run <code className="text-foreground">pnpm whatsapp:bot</code>, scan the QR,
              keep it open, then try again.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSent(false);
            setWhatsapp(null);
          }}
          className="text-primary mt-6 text-sm font-medium hover:underline"
        >
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-display text-foreground mb-1 text-lg font-bold">Event request</h3>
        <p className="text-muted-foreground mb-4 text-xs">
          We will confirm by phone · {site.name}, Oran
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="name">
          Name *
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your full name"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          Phone *
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={form.phone}
          onChange={set("phone")}
          placeholder="05XX XX XX XX"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@email.com"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="date">
            Date *
          </label>
          <input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={set("date")}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="time">
            Time *
          </label>
          <select
            id="time"
            required
            value={form.time}
            onChange={set("time")}
            className={fieldClass}
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="guests">
          Guests *
        </label>
        <select
          id="guests"
          required
          value={form.guests}
          onChange={set("guests")}
          className={fieldClass}
        >
          {guestOptions.map((g) => (
            <option key={g} value={g}>
              {g} {g === "1" ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={set("notes")}
          placeholder="Occasion, setup, dietary needs…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && (
        <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-lg border px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-primary/90 w-full rounded-lg py-3.5 text-sm font-bold tracking-wider text-white uppercase shadow-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Sending…" : "Request event"}
      </button>
      <p className="text-muted-foreground text-center text-xs">
        Prefer to call?{" "}
        <a href={site.phoneHref} className="text-primary font-medium hover:underline">
          {site.phone}
        </a>
      </p>
    </form>
  );
}
