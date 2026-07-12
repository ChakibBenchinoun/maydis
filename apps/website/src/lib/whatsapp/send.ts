import { formatPhoneDisplay, normalizeWhatsAppPhone } from "@/lib/phone";
import {
  guestBookingMessage,
  ownerBookingMessage,
  type EventBooking,
} from "@/lib/whatsapp/messages";

export type WhatsAppSendResult = {
  ok: boolean;
  to: string;
  provider: string;
  error?: string;
};

export type WhatsAppNotifyResult = {
  owner: WhatsAppSendResult;
  guest: WhatsAppSendResult;
  /** Human hint when something is offline / not configured */
  setupHint?: string;
};

/**
 * Owner WhatsApp for booking alerts.
 * Dev default: 0540580738 (DZ) → 213540580738
 */
export function getOwnerWhatsAppPhone(): string {
  const fromEnv = process.env.WHATSAPP_OWNER_PHONE?.trim();
  if (fromEnv) {
    return normalizeWhatsAppPhone(fromEnv) ?? "213540580738";
  }
  return "213540580738";
}

function botBaseUrl(): string {
  return (process.env.WHATSAPP_BOT_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "");
}

function botAuthHeaders(): HeadersInit {
  const secret = process.env.WHATSAPP_BOT_SECRET?.trim();
  if (!secret) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  };
}

/** True when free Baileys bot is up and QR has been scanned. */
export async function isBaileysBotReady(): Promise<{ ready: boolean; detail: string }> {
  const base = botBaseUrl();
  try {
    const res = await fetch(`${base}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      return { ready: false, detail: `Bot HTTP ${res.status} at ${base}` };
    }
    const body = (await res.json()) as { ready?: boolean; hasQr?: boolean };
    if (body.ready) return { ready: true, detail: "Baileys bot connected" };
    if (body.hasQr) {
      return {
        ready: false,
        detail: `Baileys bot is running — open ${base}/qr.png and scan (WhatsApp → Linked devices)`,
      };
    }
    return { ready: false, detail: "Baileys bot is running but not linked yet" };
  } catch {
    return {
      ready: false,
      detail: `Baileys bot not reachable at ${base}. Local: pnpm whatsapp:bot · Production: see docs/WHATSAPP.md`,
    };
  }
}

/**
 * Send a WhatsApp text via a free provider.
 * Prefer Baileys bot when healthy; optional CallMeBot for owner-only.
 */
export async function sendWhatsAppText(
  toRaw: string,
  text: string,
  options?: { prefer?: "baileys" | "callmebot" | "log" },
): Promise<WhatsAppSendResult> {
  const to = normalizeWhatsAppPhone(toRaw);
  if (!to) {
    return { ok: false, to: toRaw, provider: "none", error: "Invalid phone number" };
  }

  const forced = (options?.prefer || process.env.WHATSAPP_PROVIDER || "").toLowerCase();

  // Explicit provider
  if (forced === "log") return sendViaLog(to, text);
  if (forced === "callmebot") return sendViaCallMeBot(to, text);
  if (forced === "baileys") return sendViaBaileysBot(to, text);

  // Auto: baileys if up, else callmebot if keyed, else log
  const health = await isBaileysBotReady();
  if (health.ready || process.env.WHATSAPP_BOT_URL) {
    const viaBot = await sendViaBaileysBot(to, text);
    if (viaBot.ok) return viaBot;
    // fall through to callmebot / log
    if (process.env.CALLMEBOT_APIKEY) {
      const viaCmb = await sendViaCallMeBot(to, text);
      if (viaCmb.ok) return viaCmb;
      return {
        ok: false,
        to,
        provider: "baileys+callmebot",
        error: `${viaBot.error || "baileys failed"}; ${viaCmb.error || "callmebot failed"}`,
      };
    }
    return viaBot;
  }

  if (process.env.CALLMEBOT_APIKEY) {
    return sendViaCallMeBot(to, text);
  }

  return sendViaLog(to, text);
}

async function sendViaBaileysBot(to: string, text: string): Promise<WhatsAppSendResult> {
  const base = botBaseUrl();
  try {
    const res = await fetch(`${base}/send`, {
      method: "POST",
      headers: botAuthHeaders(),
      body: JSON.stringify({ phone: to, text }),
      signal: AbortSignal.timeout(20000),
    });

    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || body.ok === false) {
      return {
        ok: false,
        to,
        provider: "baileys",
        error: body.error || `HTTP ${res.status}`,
      };
    }
    return { ok: true, to, provider: "baileys" };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "TimeoutError"
          ? "Bot timed out"
          : err.message
        : "Bot unreachable";
    return {
      ok: false,
      to,
      provider: "baileys",
      error: `${message} (${base}). See docs/WHATSAPP.md (production bot URL + secret).`,
    };
  }
}

/**
 * CallMeBot free HTTP API — usually only delivers to the registered owner phone.
 * @see https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
async function sendViaCallMeBot(to: string, text: string): Promise<WhatsAppSendResult> {
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) {
    return { ok: false, to, provider: "callmebot", error: "CALLMEBOT_APIKEY missing" };
  }

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", to);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apikey);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    const failed = !res.ok || /error|invalid|not registered|wrong/i.test(body);
    if (failed) {
      return {
        ok: false,
        to,
        provider: "callmebot",
        error: body.slice(0, 200) || `HTTP ${res.status}`,
      };
    }
    return { ok: true, to, provider: "callmebot" };
  } catch (err) {
    return {
      ok: false,
      to,
      provider: "callmebot",
      error: err instanceof Error ? err.message : "CallMeBot request failed",
    };
  }
}

function sendViaLog(to: string, text: string): WhatsAppSendResult {
  console.info(
    `[whatsapp:log] → ${formatPhoneDisplay(to)}\n---\n${text}\n---\n` +
      `(No live send. Start free bot: pnpm whatsapp:bot — then set WHATSAPP_BOT_URL=http://127.0.0.1:3100)`,
  );
  return {
    ok: false,
    to,
    provider: "log",
    error: "WhatsApp not configured (log only). Run pnpm whatsapp:bot and scan QR.",
  };
}

/**
 * Notify owner + guest after a successful event booking.
 * Never throws — reservation is already saved.
 */
export async function notifyEventBookingWhatsApp(
  booking: Omit<EventBooking, "phoneE164"> & { phone: string },
): Promise<WhatsAppNotifyResult> {
  const phoneE164 = normalizeWhatsAppPhone(booking.phone);
  if (!phoneE164) {
    const bad = {
      ok: false,
      to: booking.phone,
      provider: "none",
      error: "Invalid guest phone",
    } satisfies WhatsAppSendResult;
    return {
      owner: bad,
      guest: bad,
      setupHint: "Guest phone could not be normalized (use 05… or +213…).",
    };
  }

  const payload: EventBooking = { ...booking, phoneE164 };
  const ownerPhone = getOwnerWhatsAppPhone();
  const health = await isBaileysBotReady();

  const ownerText = ownerBookingMessage(payload);
  const guestText = guestBookingMessage(payload);

  let owner: WhatsAppSendResult;
  let guest: WhatsAppSendResult;

  if (health.ready) {
    [owner, guest] = await Promise.all([
      sendWhatsAppText(ownerPhone, ownerText, { prefer: "baileys" }),
      sendWhatsAppText(phoneE164, guestText, { prefer: "baileys" }),
    ]);
  } else {
    // Bot offline: try CallMeBot for owner; guest cannot be messaged free without the bot
    if (process.env.CALLMEBOT_APIKEY) {
      owner = await sendWhatsAppText(ownerPhone, ownerText, { prefer: "callmebot" });
    } else {
      owner = {
        ok: false,
        to: ownerPhone,
        provider: "none",
        error: health.detail,
      };
      // still log full message for local debugging
      sendViaLog(ownerPhone, ownerText);
    }

    guest = {
      ok: false,
      to: phoneE164,
      provider: "none",
      error: health.detail,
    };
    sendViaLog(phoneE164, guestText);
  }

  const setupHint =
    owner.ok && guest.ok
      ? undefined
      : !health.ready
        ? health.detail
        : [owner.error, guest.error].filter(Boolean).join(" · ") || undefined;

  console.info("[whatsapp] booking notify", {
    botReady: health.ready,
    owner: { ok: owner.ok, provider: owner.provider, error: owner.error },
    guest: { ok: guest.ok, provider: guest.provider, error: guest.error },
  });

  return { owner, guest, setupHint };
}
