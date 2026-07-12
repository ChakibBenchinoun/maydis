/**
 * Normalize phone numbers for WhatsApp (digits only, E.164 without +).
 * Defaults to Algeria (213) when a local 0… mobile is provided.
 */
export function normalizeWhatsAppPhone(raw: string, defaultCountryCode = "213"): string | null {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  // 00 213 … → 213 …
  if (digits.startsWith("00")) digits = digits.slice(2);

  // Local DZ mobile: 05… / 06… / 07… → 2135… / 2136… / 2137…
  if (digits.startsWith("0") && digits.length >= 9 && digits.length <= 10) {
    digits = defaultCountryCode + digits.slice(1);
  }

  // Already has country code (e.g. 213540580738)
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

/** Format for display: +213 540 58 07 38 */
export function formatPhoneDisplay(e164Digits: string): string {
  if (e164Digits.startsWith("213") && e164Digits.length === 12) {
    const rest = e164Digits.slice(3);
    return `+213 ${rest.slice(0, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
  }
  return `+${e164Digits}`;
}
