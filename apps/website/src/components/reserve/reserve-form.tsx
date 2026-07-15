"use client";

import { useForm } from "@tanstack/react-form";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fireReserveConfetti } from "@/lib/confetti";
import { openingHours, site } from "@/lib/constants";
import { clampPhoneDigits, formatDisplayDate } from "@/lib/reservations/options";
import {
  RESERVE_STEPS,
  type ReserveFormValues,
  fieldErrorAfterChange,
  validateReserveStep,
} from "@/lib/reservations/schema";

import { ReserveCalendar } from "./reserve-calendar";
import { errorClass, fieldClass, labelClass } from "./reserve-field-styles";
import { ReserveGuestStepper } from "./reserve-guest-stepper";
import { ReserveStepper } from "./reserve-stepper";
import { ReserveSuccess, type WhatsAppStatus } from "./reserve-success";
import { ReserveTimeSlots } from "./reserve-time-slots";

const initialValues: ReserveFormValues = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "12:00",
  eventName: "",
  guests: "2",
  notes: "",
};

const EVENT_NAME_OPTIONS = [
  "Birthday",
  "Party",
  "Special event",
  "Family gathering",
] as const;

/** Keeps the card from jumping when switching steps (calendar is tallest). */
const STEP_BODY_MIN_H = "min-h-[28rem] sm:min-h-[30rem]";

export function ReserveForm() {
  const headingId = useId();
  const cardTopRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [whatsapp, setWhatsapp] = useState<WhatsAppStatus | null>(null);

  /** Keep the form card in view when changing steps (sticky nav offset). */
  function scrollToCardTop() {
    requestAnimationFrame(() => {
      cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
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
        form.reset();
        setStep(0);
        fireReserveConfetti();
        scrollToCardTop();
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Request failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const lastStep = RESERVE_STEPS.length - 1;

  function clearErrors() {
    setStepError(null);
    setFieldErrors({});
    setSubmitError(null);
  }

  /**
   * Update value always. Errors only appear after Continue/submit.
   * While an error is already shown, clear it once the value becomes valid.
   * Never introduce a new error mid-typing.
   */
  function updateField(
    name: keyof ReserveFormValues,
    value: string,
    setValue: (v: string) => void,
  ) {
    setValue(value);
    setFieldErrors((prev) => {
      if (!(name in prev)) return prev;
      const nextValues = { ...form.state.values, [name]: value };
      const stillInvalid = fieldErrorAfterChange(name, nextValues);
      if (stillInvalid) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setStepError((msg) => {
      if (!msg) return null;
      const nextValues = { ...form.state.values, [name]: value };
      const stillInvalid = fieldErrorAfterChange(name, nextValues);
      return stillInvalid ? msg : null;
    });
  }

  function goNext() {
    if (step >= lastStep) return;
    const values = form.state.values;
    const result = validateReserveStep(step, values);
    if (!result.ok) {
      setStepError(result.message);
      setFieldErrors(result.fieldErrors);
      scrollToCardTop();
      return;
    }
    clearErrors();
    setStep((s) => Math.min(s + 1, lastStep));
    scrollToCardTop();
  }

  function goBack() {
    if (loading) return;
    clearErrors();
    setStep((s) => Math.max(s - 1, 0));
    scrollToCardTop();
  }

  function submitReservation() {
    if (step !== lastStep || loading) return;
    const values = form.state.values;
    const result = validateReserveStep(lastStep, values);
    if (!result.ok) {
      setStepError(result.message);
      setFieldErrors(result.fieldErrors);
      return;
    }
    clearErrors();
    void form.handleSubmit();
  }

  if (sent) {
    return (
      <ReserveSuccess
        whatsapp={whatsapp}
        onAgain={() => {
          setSent(false);
          setWhatsapp(null);
          form.reset();
          setStep(0);
          clearErrors();
        }}
      />
    );
  }

  const stepTitle = RESERVE_STEPS[step]?.label ?? "Reserve";

  return (
    <div ref={cardTopRef} className="flex scroll-mt-28 flex-col">
      {/* Progress only after leaving Info (after "Start request") */}
      {step > 0 ? <ReserveStepper currentStep={step} /> : null}

      <h4 id={headingId} className="sr-only">
        {step === 0 ? "Before you book" : `Step ${step}: ${stepTitle}`}
      </h4>

      <form
        className="flex flex-1 flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (step < lastStep) {
            goNext();
            return;
          }
          submitReservation();
        }}
        aria-labelledby={headingId}
      >
        {/* Fixed-height body so the card does not jump between steps */}
        <div className={`${STEP_BODY_MIN_H} flex flex-col`}>
          {/* 0 — Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-foreground mb-4 text-xl font-bold sm:text-2xl">
                  Welcome to {site.name}
                </h4>
                <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                  A glimpse of what we share with you — space, tables, food, and the feeling of a
                  slow good day in Oran.
                </p>
                <ul className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>
                      <span className="text-foreground font-medium">Indoor & outdoor space</span>
                      {" — "}
                      bright interior seating and a garden-like terrace for sunny days and golden
                      evenings.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>
                      <span className="text-foreground font-medium">Tables for every gathering</span>
                      {" — "}
                      intimate corners for two, family tables, and room for larger celebrations
                      when booked in advance.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>
                      <span className="text-foreground font-medium">Food with variety</span>
                      {" — "}
                      brunch plates, bowls, cakes, and drinks — something for slow mornings and
                      long lunches.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>
                      <span className="text-foreground font-medium">The vibe</span>
                      {" — "}
                      calm, warm, and welcoming. Come for the food, stay for the atmosphere.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-border/50 border-t pt-5">
                <h4 className="font-display text-foreground mb-3 text-base font-bold">
                  Before you book
                </h4>
                <ul className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>Requests are confirmed by our team — not instant auto-booking.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>We will confirm by phone or WhatsApp message.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    <span>
                      Same-day or larger parties: call{" "}
                      <a
                        href={site.phoneHref}
                        className="text-primary font-semibold hover:underline"
                      >
                        {site.phone}
                      </a>
                      .
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-border/50 border-t pt-5">
                <h4 className="font-display text-foreground mb-3 text-base font-bold">
                  Opening hours
                </h4>
                <div className="space-y-2.5">
                  {openingHours.map(({ day, hours }) => (
                    <div key={day} className="flex justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="text-foreground shrink-0 font-semibold tabular-nums">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 1 — Contact */}
          {step === 1 && (
            <div className="space-y-5">
              <form.Field name="name">
                {(field) => (
                  <div>
                    <label className={labelClass} htmlFor={field.name}>
                      Name *
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        updateField("name", e.target.value, field.handleChange)
                      }
                      placeholder="Your full name"
                      className={fieldClass}
                      autoComplete="name"
                    />
                    {fieldErrors.name ? <p className={errorClass}>{fieldErrors.name}</p> : null}
                  </div>
                )}
              </form.Field>

              <form.Field name="phone">
                {(field) => (
                  <div>
                    <label className={labelClass} htmlFor={field.name}>
                      Phone *
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          clampPhoneDigits(e.target.value),
                          field.handleChange,
                        )
                      }
                      placeholder="05XXXXXXXX"
                      className={fieldClass}
                      autoComplete="tel-national"
                    />
                    <p className="text-muted-foreground mt-1.5 text-[11px]">
                      10 digits · Algerian mobile (05 / 06 / 07)
                    </p>
                    {fieldErrors.phone ? (
                      <p className={errorClass}>{fieldErrors.phone}</p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div>
                    <label className={labelClass} htmlFor={field.name}>
                      Email (optional)
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        updateField("email", e.target.value, field.handleChange)
                      }
                      placeholder="you@email.com"
                      className={fieldClass}
                      autoComplete="email"
                    />
                    {fieldErrors.email ? (
                      <p className={errorClass}>{fieldErrors.email}</p>
                    ) : null}
                  </div>
                )}
              </form.Field>
            </div>
          )}

          {/* 2 — Schedule */}
          {step === 2 && (
            <div className="space-y-5">
              <form.Field name="date">
                {(field) => (
                  <div>
                    <p className={labelClass}>Date *</p>
                    <ReserveCalendar
                      value={field.state.value}
                      onChange={(iso) => updateField("date", iso, field.handleChange)}
                    />
                    {fieldErrors.date ? <p className={errorClass}>{fieldErrors.date}</p> : null}
                  </div>
                )}
              </form.Field>

              <form.Field name="time">
                {(field) => (
                  <div>
                    <ReserveTimeSlots
                      value={field.state.value}
                      onChange={(t) => updateField("time", t, field.handleChange)}
                    />
                    {fieldErrors.time ? <p className={errorClass}>{fieldErrors.time}</p> : null}
                  </div>
                )}
              </form.Field>
            </div>
          )}

          {/* 3 — Details */}
          {step === 3 && (
            <div className="space-y-5">
              <form.Field name="eventName">
                {(field) => {
                  const selected = field.state.value;
                  const isPreset = (EVENT_NAME_OPTIONS as readonly string[]).includes(
                    selected,
                  );

                  return (
                    <div>
                      <p className={labelClass} id={`${field.name}-label`}>
                        Event name *
                      </p>
                      <div
                        className="grid w-full grid-cols-2 gap-2"
                        role="listbox"
                        aria-labelledby={`${field.name}-label`}
                      >
                        {EVENT_NAME_OPTIONS.map((option) => {
                          const active = selected === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={active}
                              onClick={() =>
                                updateField("eventName", option, field.handleChange)
                              }
                              className={cn(
                                "w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                                active
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-border bg-secondary text-foreground hover:border-primary/40",
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2">
                        <input
                          id={field.name}
                          name={field.name}
                          value={isPreset ? "" : selected}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            updateField("eventName", e.target.value, field.handleChange)
                          }
                          placeholder="Or type your own event…"
                          className={fieldClass}
                          autoComplete="off"
                        />
                      </div>
                      {fieldErrors.eventName ? (
                        <p className={errorClass}>{fieldErrors.eventName}</p>
                      ) : null}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="guests">
                {(field) => (
                  <div>
                    <p className={labelClass} id={`${field.name}-label`}>
                      Event size *
                    </p>
                    <ReserveGuestStepper
                      id={field.name}
                      value={field.state.value}
                      onChange={(v) => updateField("guests", v, field.handleChange)}
                    />
                    {fieldErrors.guests ? (
                      <p className={errorClass}>{fieldErrors.guests}</p>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field name="notes">
                {(field) => (
                  <div>
                    <label className={labelClass} htmlFor={field.name}>
                      Notes (optional)
                    </label>
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        updateField("notes", e.target.value, field.handleChange)
                      }
                      placeholder="Setup, dietary needs, decorations…"
                      className={`${fieldClass} resize-none`}
                    />
                    {fieldErrors.notes ? (
                      <p className={errorClass}>{fieldErrors.notes}</p>
                    ) : null}
                  </div>
                )}
              </form.Field>
            </div>
          )}

          {/* 4 — Review */}
          {step === 4 && (
            <form.Subscribe selector={(s) => s.values}>
              {(values) => (
                <div>
                  <h4 className="font-display text-foreground text-base font-bold">
                    Confirm your request
                  </h4>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    Check everything looks right before sending.
                  </p>
                  <div className="border-border/60 mt-5 border-t">
                    <dl className="divide-border/60 divide-y">
                      <ReviewDlRow label="Full name" value={values.name} />
                      <ReviewDlRow label="Phone" value={values.phone} />
                      {values.email ? (
                        <ReviewDlRow label="Email" value={values.email} />
                      ) : null}
                      <ReviewDlRow label="Event" value={values.eventName} />
                      <ReviewDlRow label="Date" value={formatDisplayDate(values.date)} />
                      <ReviewDlRow label="Time" value={values.time} />
                      <ReviewDlRow
                        label="Event size"
                        value={`${values.guests} ${values.guests === "1" ? "guest" : "guests"}`}
                      />
                      {values.notes ? (
                        <ReviewDlRow label="Notes" value={values.notes} />
                      ) : null}
                    </dl>
                  </div>
                </div>
              )}
            </form.Subscribe>
          )}
        </div>

        {(stepError || submitError) && (
          <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-lg border px-3 py-2.5 text-sm">
            {submitError || stepError}
          </p>
        )}

        <div className="mt-auto flex gap-3 pt-6">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-lg normal-case tracking-normal"
              onClick={goBack}
              disabled={loading}
            >
              Back
            </Button>
          ) : null}
          {step < lastStep ? (
            <Button
              type="button"
              variant="primary"
              className="flex-1 rounded-lg normal-case tracking-normal"
              onClick={goNext}
            >
              {step === 0 ? "Start request" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={loading}
              className="flex-1 rounded-lg normal-case tracking-normal"
              onClick={submitReservation}
            >
              {loading ? "Sending…" : "Request event"}
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Prefer to call?{" "}
          <a href={site.phoneHref} className="text-primary font-medium hover:underline">
            {site.phone}
          </a>
        </p>
      </form>
    </div>
  );
}

function ReviewDlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-0 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-foreground text-sm font-medium">{label}</dt>
      <dd className="text-muted-foreground mt-1 text-sm break-words sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );
}
