"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fireReserveConfetti } from "@/lib/confetti";
import { openingHours, site } from "@/lib/constants";
import { clampPhoneDigits, formatDisplayDate } from "@/lib/reservations/options";
import {
  EVENT_FOR_MAX,
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

/**
 * Soft floor so short steps don’t collapse under the footer on tall screens.
 * Not a rigid “app card” height — calendar step can grow naturally.
 */
const STEP_BODY_MIN_H = "min-h-[20rem] sm:min-h-[22rem]";

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

  // After success mounts, scroll to card top (ref exists again on success wrapper)
  useEffect(() => {
    if (!sent) return;
    const t = window.setTimeout(() => scrollToCardTop(), 50);
    return () => window.clearTimeout(t);
  }, [sent]);

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
        form.reset();
        setStep(0);
        setSent(true);
        fireReserveConfetti();
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

  const stepTitle = RESERVE_STEPS[step]?.label ?? "Reserve";

  if (sent) {
    return (
      <div ref={cardTopRef} className="flex scroll-mt-28 flex-col">
        <ReserveSuccess
          whatsapp={whatsapp}
          onAgain={() => {
            setSent(false);
            setWhatsapp(null);
            form.reset();
            setStep(0);
            clearErrors();
            requestAnimationFrame(() => scrollToCardTop());
          }}
        />
      </div>
    );
  }

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
        <div className={`${STEP_BODY_MIN_H} flex flex-col`}>
          {/* 0 — Info (centered like the page header) */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div>
                <h4 className="font-display text-foreground mb-4 text-xl font-bold sm:text-2xl">
                  Welcome to {site.name}
                </h4>
                <p className="text-muted-foreground mx-auto mb-5 max-w-md text-sm leading-relaxed">
                  A glimpse of what we share with you — space, tables, food, and the feeling of a
                  slow good day in Oran.
                </p>
                <ul className="mx-auto max-w-md space-y-5 text-sm leading-relaxed">
                  <li>
                    <p className="text-foreground mb-1 font-semibold">Indoor & outdoor space</p>
                    <p className="text-muted-foreground">
                      Bright interior seating and a garden-like terrace for sunny days and golden
                      evenings.
                    </p>
                  </li>
                  <li>
                    <p className="text-foreground mb-1 font-semibold">Tables for every gathering</p>
                    <p className="text-muted-foreground">
                      Intimate corners for two, family tables, and room for larger celebrations when
                      booked in advance.
                    </p>
                  </li>
                  <li>
                    <p className="text-foreground mb-1 font-semibold">Food with variety</p>
                    <p className="text-muted-foreground">
                      Brunch plates, bowls, cakes, and drinks — something for slow mornings and long
                      lunches.
                    </p>
                  </li>
                  <li>
                    <p className="text-foreground mb-1 font-semibold">The vibe</p>
                    <p className="text-muted-foreground">
                      Calm, warm, and welcoming. Come for the food, stay for the atmosphere.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="border-border/50 border-t pt-5">
                <h4 className="font-display text-foreground mb-3 text-base font-bold">
                  Before you book
                </h4>
                <ul className="text-muted-foreground mx-auto max-w-md space-y-3 text-sm leading-relaxed">
                  <li>Requests are confirmed by our team — not instant auto-booking.</li>
                  <li>We will confirm by phone or WhatsApp message.</li>
                  <li>
                    Same-day or larger parties: call{" "}
                    <a
                      href={site.phoneHref}
                      className="text-primary font-semibold hover:underline"
                    >
                      {site.phone}
                    </a>
                    .
                  </li>
                </ul>
              </div>

              <div className="border-border/50 border-t pt-5">
                <h4 className="font-display text-foreground mb-3 text-base font-bold">
                  Opening hours
                </h4>
                <div className="mx-auto inline-grid max-w-full grid-cols-[auto_auto] gap-x-8 gap-y-2.5 text-left text-sm">
                  {openingHours.map(({ day, hours }) => (
                    <div key={day} className="contents">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="text-foreground text-right font-semibold tabular-nums">
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
                  const len = field.state.value.length;
                  return (
                    <div>
                      <div className="mb-2.5 flex items-baseline justify-between gap-3">
                        <label className={cn(labelClass, "mb-0")} htmlFor={field.name}>
                          Event for *
                        </label>
                        <span
                          className={cn(
                            "text-[11px] tabular-nums",
                            len >= EVENT_FOR_MAX
                              ? "text-destructive"
                              : "text-muted-foreground",
                          )}
                        >
                          {len}/{EVENT_FOR_MAX}
                        </span>
                      </div>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          updateField(
                            "eventName",
                            e.target.value.slice(0, EVENT_FOR_MAX),
                            field.handleChange,
                          )
                        }
                        maxLength={EVENT_FOR_MAX}
                        placeholder="e.g. Sara’s birthday, team lunch…"
                        className={fieldClass}
                        autoComplete="off"
                      />
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
                      <ReviewDlRow label="Event for" value={values.eventName} />
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

        <div className="mt-auto flex gap-3 border-border/40 border-t pt-8">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full normal-case tracking-normal"
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
              className="flex-1 rounded-full normal-case tracking-normal"
              onClick={goNext}
            >
              {step === 0 ? "Start request" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={loading}
              className="flex-1 rounded-full normal-case tracking-normal"
              onClick={submitReservation}
            >
              {loading ? "Sending…" : "Request event"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function ReviewDlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-0 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-foreground text-sm font-medium">{label}</dt>
      <dd className="text-muted-foreground mt-1 text-sm wrap-break-word sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );
}
