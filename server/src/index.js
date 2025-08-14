// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const { z } = require("zod");

const app = express();

// --- Config from .env (with sane fallbacks for dev) ---
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const EMAIL_TO = process.env.EMAIL_TO; // REQUIRED
const EMAIL_FROM = process.env.EMAIL_FROM || '"Website" <no-reply@example.com>';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);

// --- Basic guards to help you catch missing env quickly ---
if (!EMAIL_TO) console.warn("[WARN] EMAIL_TO is not set in .env");
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn("[WARN] SMTP credentials are missing. Email sending will fail.");
}

// --- Middleware ---
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["POST", "GET", "OPTIONS"],
    credentials: false,
  })
);
app.use(express.json({ limit: "100kb" }));

// --- Rate limiting (per IP) ---
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // e.g., 60 seconds
  max: RATE_LIMIT_MAX,            // e.g., 5 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use("/api/", limiter);

// --- Validation schema (Zod) ---
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(1, "Message is required").max(5000),
  // Optional fields:
  company: z.string().max(150).optional().or(z.literal("")).transform((v) => v || undefined),
  phone: z.string().max(30).optional().or(z.literal("")).transform((v) => v || undefined),
  subject: z.string().max(150).optional().or(z.literal("")).transform((v) => v || undefined),
});

// --- Mail transporter ---
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for 587/25
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// --- Health check (useful in dev/deploy) ---
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "sogas-backend", time: new Date().toISOString() });
});

// --- Contact endpoint ---
app.post("/api/contact", async (req, res) => {
  try {
    // 1) Validate incoming JSON
    const data = contactSchema.parse(req.body);

    // 2) Build email content
    const lines = [
      `New contact form submission from Southern Gas Services Website`,
      "",
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      data.company ? `Company: ${data.company}` : null,
      data.phone ? `Phone:   ${data.phone}` : null,
      data.subject ? `Subject: ${data.subject}` : null,
      "",
      "Message:",
      data.message,
    ].filter(Boolean);

    // 3) Send email
    if (!EMAIL_TO) {
      // Fail fast if target isn't configured
      return res.status(500).json({
        success: false,
        message: "Email destination not configured.",
      });
    }

    const info = await transporter.sendMail({
      from: EMAIL_FROM,       // display name
      to: EMAIL_TO,           // company inbox
      replyTo: data.email,    // hitting Reply goes to the sender
      subject: data.subject || `New message from ${data.name}`,
      text: lines.join("\n"),
      html: lines.map((l) => (l === "" ? "<br/>" : `<div>${escapeHtml(l)}</div>`)).join(""),

      //Force MAIN FROM to match mailbox
      envelope: {
        from: SMTP_USER,
        to: EMAIL_TO
      }
    });

    // 4) Respond success
    return res.status(200).json({
      success: true,
      message: "Your message has been sent.",
      id: info.messageId,
    });
  } catch (err) {
    // Zod validation errors
    if (err instanceof z.ZodError) {
      const errors = {};
      for (const e of err.issues) {
        const key = e.path[0] || "form";
        errors[key] = e.message;
      }
      return res.status(400).json({ success: false, errors });
    }

    console.error("[/api/contact] Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Unable to send your message right now. Please try again later." });
  }
});

// --- 404 for unknown routes under /api ---
app.use("/api/*", (_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`SOGAS backend listening on http://localhost:${PORT}`);
});

// --- tiny helper to safely render text in HTML email ---
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
