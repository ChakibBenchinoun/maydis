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

export function ReserveForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again or call us.");
      }
      setSent(true);
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">Request received</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          We will confirm your table as soon as possible. For same-day bookings, call{" "}
          <a href={site.phoneHref} className="text-primary font-semibold hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-primary hover:underline font-medium"
        >
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-1">
          Reservation form
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
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
          placeholder="Occasion, allergies, high chair…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-primary text-white font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors rounded-lg shadow-sm disabled:opacity-60"
      >
        {loading ? "Sending…" : "Request reservation"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Prefer to call?{" "}
        <a href={site.phoneHref} className="text-primary font-medium hover:underline">
          {site.phone}
        </a>
      </p>
    </form>
  );
}
