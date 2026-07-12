/**
 * Free WhatsApp bridge (Baileys) — local dev + production VPS.
 *
 * Local:
 *   pnpm whatsapp:bot
 *   Scan apps/whatsapp-bot/qr.png
 *   WHATSAPP_BOT_URL=http://127.0.0.1:3100
 *
 * Production (Railway / Render / Fly / VPS):
 *   Deploy this app, set WHATSAPP_BOT_SECRET, scan QR via logs or /qr.png once
 *   Vercel: WHATSAPP_BOT_URL=https://your-bot.up.railway.app
 *           WHATSAPP_BOT_SECRET=<same secret>
 *
 * POST /send  Authorization: Bearer <WHATSAPP_BOT_SECRET>
 *             { "phone": "213540580738", "text": "Hello" }
 * GET  /health  (public)
 * GET  /qr.png  (public while linking — disable after connect if desired)
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
const logger = pino({ level: process.env.LOG_LEVEL || (IS_PROD ? "info" : "silent") });

mkdirSync(AUTH_DIR, { recursive: true });

/** @type {import('@whiskeysockets/baileys').WASocket | null} */
let sock = null;
let ready = false;
let lastQr = null;

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
  // Local dev without secret is allowed; production must set a secret
  if (!SECRET) {
    if (IS_PROD) return false;
    return true;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const query = new URL(req.url || "/", "http://localhost").searchParams.get("secret");
  return token === SECRET || query === SECRET;
}

async function saveQr(qr) {
  lastQr = qr;
  ready = false;
  try {
    await QRCode.toFile(QR_PNG, qr, {
      type: "png",
      width: 400,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    console.log("\n[whatsapp-bot] ══════════════════════════════════════════");
    console.log("[whatsapp-bot] SCAN QR to link WhatsApp:");
    console.log(`[whatsapp-bot]   File: ${QR_PNG}`);
    console.log("[whatsapp-bot]   Or open GET /qr.png on this host once");
    console.log("[whatsapp-bot] WhatsApp → Linked devices → Link a device");
    console.log("[whatsapp-bot] ══════════════════════════════════════════\n");
    if (!IS_PROD) qrcodeTerminal.generate(qr, { small: true });
  } catch (err) {
    console.error("[whatsapp-bot] Could not write qr.png", err.message);
    if (!IS_PROD) qrcodeTerminal.generate(qr, { small: true });
  }
}

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      saveQr(qr).catch((e) => console.error(e));
    }

    if (connection === "open") {
      ready = true;
      lastQr = null;
      console.log("\n[whatsapp-bot] ✅ Connected — ready for production traffic\n");
    }

    if (connection === "close") {
      ready = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.warn("[whatsapp-bot] Connection closed", { code, shouldReconnect });
      if (shouldReconnect) {
        startSocket().catch((err) => console.error("[whatsapp-bot] reconnect failed", err));
      } else {
        console.error(
          "[whatsapp-bot] Logged out — clear auth volume and scan QR again.",
        );
      }
    }
  });
}

async function handleSend(body) {
  if (!ready || !sock) {
    const err = new Error(
      lastQr
        ? "WhatsApp not linked yet — scan QR (GET /qr.png or apps/whatsapp-bot/qr.png)"
        : "WhatsApp bot not connected",
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

  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  const url = req.url || "/";

  if (req.method === "GET" && (url === "/health" || url.startsWith("/health?"))) {
    res.writeHead(200, { ...cors, "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        ready,
        hasQr: Boolean(lastQr),
        secretRequired: Boolean(SECRET) || IS_PROD,
      }),
    );
    return;
  }

  // Serve QR image while linking (useful on remote hosts)
  if (req.method === "GET" && (url === "/qr.png" || url.startsWith("/qr.png?"))) {
    if (existsSync(QR_PNG)) {
      res.writeHead(200, { ...cors, "Content-Type": "image/png", "Cache-Control": "no-store" });
      res.end(readFileSync(QR_PNG));
    } else {
      res.writeHead(404, { ...cors, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No QR yet — wait for connection.init or already linked" }));
    }
    return;
  }

  if (req.method === "POST" && url === "/send") {
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
  res.end(JSON.stringify({ error: "Not found" }));
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`
[whatsapp-bot] Port ${PORT} is already in use.
  curl http://127.0.0.1:${PORT}/health
  lsof -tiTCP:${PORT} -sTCP:LISTEN | xargs kill
`);
    process.exit(1);
  }
  console.error("[whatsapp-bot] Server error", err);
  process.exit(1);
});

startSocket()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`[whatsapp-bot] Listening on http://${HOST}:${PORT}`);
      console.log(`[whatsapp-bot] Health: GET /health`);
      if (!SECRET && IS_PROD) {
        console.warn("[whatsapp-bot] WARNING: set WHATSAPP_BOT_SECRET in production");
      }
      if (SECRET) {
        console.log("[whatsapp-bot] /send requires Authorization: Bearer <WHATSAPP_BOT_SECRET>");
      }
    });
  })
  .catch((err) => {
    console.error("[whatsapp-bot] Failed to start socket", err);
    process.exit(1);
  });
