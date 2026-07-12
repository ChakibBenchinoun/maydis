/**
 * Free WhatsApp bridge (Baileys) — local + Railway.
 *
 * HTTP starts FIRST so /health always responds (avoids Railway "failed to respond").
 * WhatsApp socket connects in the background.
 *
 * GET  /health
 * GET  /qr.png
 * POST /send  Authorization: Bearer <WHATSAPP_BOT_SECRET>
 */

import { createServer } from "node:http";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import baileys, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import qrcodeTerminal from "qrcode-terminal";
import pino from "pino";

const makeWASocket =
  typeof baileys === "function" ? baileys : baileys.makeWASocket;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || join(ROOT, "auth");
const QR_PNG = join(ROOT, "qr.png");
const PORT = Number(process.env.PORT || process.env.WHATSAPP_BOT_PORT || 3100);
const HOST = process.env.WHATSAPP_BOT_HOST || "0.0.0.0";
const SECRET = (process.env.WHATSAPP_BOT_SECRET || "").trim();
const IS_PROD = process.env.NODE_ENV === "production";
const logger = pino({ level: process.env.LOG_LEVEL || (IS_PROD ? "info" : "warn") });

mkdirSync(AUTH_DIR, { recursive: true });

/** @type {import('@whiskeysockets/baileys').WASocket | null} */
let sock = null;
let ready = false;
let lastQr = null;
let waStatus = "starting"; // starting | qr | open | closed
let lastError = null;
let startingSocket = false;

function toJid(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) throw new Error("Invalid phone");
  return `${digits}@s.whatsapp.net`;
}

function unauthorized(res, cors) {
  res.writeHead(401, { ...cors, "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "Unauthorized — set WHATSAPP_BOT_SECRET" }));
}

function checkAuth(req) {
  if (!SECRET) {
    // Local ok without secret; production should set one (still allow health without it)
    return !IS_PROD;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const query = new URL(req.url || "/", "http://localhost").searchParams.get("secret");
  return token === SECRET || query === SECRET;
}

async function saveQr(qr) {
  lastQr = qr;
  ready = false;
  waStatus = "qr";
  try {
    await QRCode.toFile(QR_PNG, qr, {
      type: "png",
      width: 400,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    console.log("[whatsapp-bot] QR ready — open GET /qr.png and scan with WhatsApp Linked devices");
    if (!IS_PROD) {
      console.log(`[whatsapp-bot] Local file: ${QR_PNG}`);
      qrcodeTerminal.generate(qr, { small: true });
    }
  } catch (err) {
    console.error("[whatsapp-bot] Could not write qr.png", err.message);
    if (!IS_PROD) qrcodeTerminal.generate(qr, { small: true });
  }
}

async function getWaVersion() {
  try {
    const { version } = await Promise.race([
      fetchLatestBaileysVersion(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("fetchLatestBaileysVersion timeout")), 15000),
      ),
    ]);
    return version;
  } catch (err) {
    console.warn("[whatsapp-bot] Using default WA version:", err.message);
    return undefined;
  }
}

async function startSocket() {
  if (startingSocket) return;
  startingSocket = true;
  lastError = null;
  waStatus = "starting";

  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const version = await getWaVersion();

    const opts = {
      auth: state,
      logger,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
    };
    if (version) opts.version = version;

    sock = makeWASocket(opts);
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        saveQr(qr).catch((e) => console.error(e));
      }

      if (connection === "open") {
        ready = true;
        lastQr = null;
        waStatus = "open";
        lastError = null;
        console.log("[whatsapp-bot] ✅ WhatsApp connected — ready to send");
      }

      if (connection === "close") {
        ready = false;
        waStatus = "closed";
        const code = lastDisconnect?.error?.output?.statusCode;
        const msg = lastDisconnect?.error?.message || "connection closed";
        lastError = `${msg} (code ${code ?? "?"})`;
        console.warn("[whatsapp-bot] Connection closed", { code, msg });

        const shouldReconnect = code !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          startingSocket = false;
          setTimeout(() => {
            startSocket().catch((err) => {
              lastError = err.message;
              console.error("[whatsapp-bot] reconnect failed", err);
            });
          }, 2000);
        } else {
          lastError = "Logged out — clear auth volume and scan QR again";
          console.error("[whatsapp-bot]", lastError);
        }
      }
    });
  } catch (err) {
    lastError = err.message || String(err);
    waStatus = "closed";
    console.error("[whatsapp-bot] startSocket failed", err);
    // Retry later without killing HTTP
    setTimeout(() => {
      startingSocket = false;
      startSocket().catch(() => {});
    }, 5000);
  } finally {
    // allow reconnect path to set startingSocket false on close
    if (waStatus === "open" || waStatus === "qr") {
      startingSocket = false;
    } else if (waStatus === "starting") {
      // keep locked briefly; connection.update will open/close soon
      setTimeout(() => {
        startingSocket = false;
      }, 3000);
    }
  }
}

async function handleSend(body) {
  if (!ready || !sock) {
    const err = new Error(
      lastQr
        ? "WhatsApp not linked yet — open /qr.png and scan"
        : `WhatsApp not connected (${waStatus})${lastError ? `: ${lastError}` : ""}`,
    );
    err.status = 503;
    throw err;
  }

  const phone = body?.phone;
  const text = body?.text;
  if (!phone || !text) {
    const err = new Error("Body must include phone and text");
    err.status = 400;
    throw err;
  }

  const jid = toJid(phone);
  await sock.sendMessage(jid, { text: String(text) });
  return { ok: true, to: String(phone).replace(/\D/g, "") };
}

const server = createServer(async (req, res) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, cors);
      res.end();
      return;
    }

    const url = req.url || "/";

    // Always respond quickly for Railway health / probes
    if (
      req.method === "GET" &&
      (url === "/" || url === "/health" || url.startsWith("/health?"))
    ) {
      res.writeHead(200, { ...cors, "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          ready,
          hasQr: Boolean(lastQr) || existsSync(QR_PNG),
          status: waStatus,
          secretRequired: Boolean(SECRET) || IS_PROD,
          error: lastError,
          port: PORT,
        }),
      );
      return;
    }

    if (req.method === "GET" && (url === "/qr.png" || url.startsWith("/qr.png?"))) {
      if (existsSync(QR_PNG)) {
        res.writeHead(200, {
          ...cors,
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        });
        res.end(readFileSync(QR_PNG));
      } else {
        res.writeHead(404, { ...cors, "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "No QR yet — wait a few seconds and refresh, or check logs",
            status: waStatus,
            ready,
          }),
        );
      }
      return;
    }

    if (req.method === "POST" && (url === "/send" || url.startsWith("/send?"))) {
      if (!checkAuth(req)) {
        unauthorized(res, cors);
        return;
      }
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
        const result = await handleSend(body);
        res.writeHead(200, { ...cors, "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        const status = err.status || 500;
        res.writeHead(status, { ...cors, "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: err.message || "Send failed" }));
      }
      return;
    }

    res.writeHead(404, { ...cors, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found. Try GET /health" }));
  } catch (err) {
    console.error("[whatsapp-bot] request error", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Internal error" }));
    }
  }
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`[whatsapp-bot] Port ${PORT} already in use`);
    process.exit(1);
  }
  console.error("[whatsapp-bot] Server error", err);
  process.exit(1);
});

// HTTP FIRST — Railway needs a listening port immediately
server.listen(PORT, HOST, () => {
  console.log(`[whatsapp-bot] HTTP listening on http://${HOST}:${PORT}`);
  console.log(`[whatsapp-bot] Health: GET /health  |  QR: GET /qr.png`);
  if (SECRET) {
    console.log("[whatsapp-bot] /send requires Authorization: Bearer <WHATSAPP_BOT_SECRET>");
  } else if (IS_PROD) {
    console.warn("[whatsapp-bot] WARNING: set WHATSAPP_BOT_SECRET in production");
  }

  // WhatsApp socket after HTTP is up
  startSocket().catch((err) => {
    lastError = err.message;
    console.error("[whatsapp-bot] Initial WhatsApp start failed (HTTP still up)", err);
  });
});
