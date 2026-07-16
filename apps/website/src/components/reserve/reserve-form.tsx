"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "@tanstack/react-form";

import { ScrollAnchor, useScrollAnchor } from "@/components/effects/scroll-anchor";
import { Button } from "@/components/ui/button";
import { fireReserveConfetti } from "@/lib/confetti";
import {
  fieldErrorAfterChange,
  RESERVE_STEPS,
  validateReserveStep,
  type ReserveFormValues,
} from "@/lib/reservations/schema";

import { ReserveStepContact } from "./reserve-step-contact";
import { ReserveStepDetails } from "./reserve-step-details";
import { ReserveStepInfo } from "./reserve-step-info";
import { ReserveStepReview } from "./reserve-step-review";
import { ReserveStepWhen } from "./reserve-step-when";
import { ReserveStepper } from "./reserve-stepper";
import { ReserveSuccess, type WhatsAppStatus } from "./reserve-success";

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

type ReserveFormProps = {
  /** Notify parent when the success “report” view is shown (hide page title). */
  onSuccessChange?: (success: boolean) => void;
};

export function ReserveForm({ onSuccessChange }: ReserveFormProps) {
  const headingId = useId();
  const { ref: cardTopRef, scrollToTop } = useScrollAnchor();
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [whatsapp, setWhatsapp] = useState<WhatsAppStatus | null>(null);

  // After success mounts, scroll to panel top (layout has swapped)
  useEffect(() => {
    if (!sent) return;
    scrollToTop({ delayMs: 50 });
  }, [sent, scrollToTop]);

  useEffect(() => {
    onSuccessChange?.(sent);
  }, [sent, onSuccessChange]);

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
        scrollToTop();
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
   * Exit success → Contact step (skip Info).
   * They already read the intro; start at the first form fields.
   */
  function startAnotherRequest() {
    form.reset();
    clearErrors();
    setWhatsapp(null);
    setLoading(false);
    setStep(1);
    setSent(false);
    onSuccessChange?.(false);
    // Form remounts after sent=false — wait a tick for the new anchor
    scrollToTop({ delayMs: 50 });
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
      scrollToTop();
      return;
    }
    clearErrors();
    setStep((s) => Math.min(s + 1, lastStep));
    scrollToTop();
  }

  function goBack() {
    if (loading) return;
    clearErrors();
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  }

  function submitReservation() {
    if (step !== lastStep || loading) return;
    const values = form.state.values;
    const result = validateReserveStep(lastStep, values);
    if (!result.ok) {
      setStepError(result.message);
      setFieldErrors(result.fieldErrors);
      scrollToTop();
      return;
    }
    clearErrors();
    void form.handleSubmit();
  }

  const stepTitle = RESERVE_STEPS[step]?.label ?? "Reserve";

  if (sent) {
    return (
      <ScrollAnchor ref={cardTopRef} scrollMarginClassName="scroll-mt-20" className="flex flex-col">
        <ReserveSuccess whatsapp={whatsapp} onAgain={startAnotherRequest} />
      </ScrollAnchor>
    );
  }

  return (
    <ScrollAnchor ref={cardTopRef} className="flex flex-col">
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
          {step === 0 ? <ReserveStepInfo /> : null}
          {step === 1 ? (
            <ReserveStepContact form={form} fieldErrors={fieldErrors} updateField={updateField} />
          ) : null}
          {step === 2 ? (
            <ReserveStepWhen form={form} fieldErrors={fieldErrors} updateField={updateField} />
          ) : null}
          {step === 3 ? (
            <ReserveStepDetails form={form} fieldErrors={fieldErrors} updateField={updateField} />
          ) : null}
          {step === 4 ? <ReserveStepReview form={form} /> : null}
        </div>

        {(stepError || submitError) && (
          <p className="text-destructive bg-destructive/10 border-destructive/20 rounded-lg border px-3 py-2.5 text-sm">
            {submitError || stepError}
          </p>
        )}

        <div className="border-border/40 mt-auto flex gap-3 border-t pt-8">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full tracking-normal normal-case"
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
              className="flex-1 rounded-full tracking-normal normal-case"
              onClick={goNext}
            >
              {step === 0 ? "Start request" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={loading}
              className="flex-1 rounded-full tracking-normal normal-case"
              onClick={submitReservation}
            >
              {loading ? "Sending…" : "Request event"}
            </Button>
          )}
        </div>
      </form>
    </ScrollAnchor>
  );
}
