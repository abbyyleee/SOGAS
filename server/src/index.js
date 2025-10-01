import express from "express";
import cors from "cors";
import helmet from "helmet";
import nodemailer from "nodemailer";
import { z } from "zod";
import dotenv from "dotenv";
import sql from "../db/database.js";

// Routes
import adminRoutes from "../routes/admin.js";
import serviceRoutes from "../routes/services.js";
import galleryRoutes from "../routes/gallery.js";
import infoRoutes from "../routes/info.js";
import siteVisitsRoutes from "../routes/site_visits.js";
import authRoutes from "../routes/auth.js";

// Middleware
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const app = express();

// --- Config from .env ---
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const EMAIL_TO = process.env.EMAIL_TO; // REQUIRED
const EMAIL_FROM = process.env.EMAIL_FROM || '"Website" <no-reply@example.com>';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// --- Guards ---
if (!EMAIL_TO) console.warn("[WARN] EMAIL_TO is not set in .env");
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.warn("[WARN] SMTP credentials are missing. Email sending will fail.");
}

// --- Middleware ---
app.use(helmet());
app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);
app.use(express.json({ limit: "50kb" }));

// --- Routes ---
app.use("/api", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/site_visits", siteVisitsRoutes);
app.use("/api/auth", authRoutes);


// --- Contact endpoint ---
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(1, "Message is required").max(5000),
  company: z.string().max(150).optional().or(z.literal("")).transform((v) => v || undefined),
  phone: z.string().max(30).optional().or(z.literal("")).transform((v) => v || undefined),
  subject: z.string().max(150).optional().or(z.literal("")).transform((v) => v || undefined),
});

function formatPhone(raw) {
  if (!raw) return undefined;
  const digits = String(raw).replace(/\D/g, "").slice(0, 11);
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return raw;
  return `(${ten.slice(0, 3)})-${ten.slice(3, 6)}-${ten.slice(6)}`;
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    const prettyPhone = data.phone ? formatPhone(data.phone) : undefined;

    const textLines = [
      "New contact form submission from Southern Gas Services website",
      "",
      `Name:    ${data.name}`,
      `Email:   ${data.email}`,
      data.company ? `Company: ${data.company}` : null,
      prettyPhone ? `Phone:   ${prettyPhone}` : null,
      data.subject ? `Subject: ${data.subject}` : null,
      "",
      "Message:",
      data.message,
    ].filter(Boolean);

    const html =
      `
      <div style="font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b2545;">
        <div style="max-width:640px;margin:24px auto;padding:20px 24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;">
          <h2 style="margin:0 0 8px 0;font-size:20px;">New contact form submission</h2>
          <p style="margin:0 0 16px 0;font-size:14px;color:#334155;">Southern Gas Services website</p>

          <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 16px 0;">
            <tbody>
              <tr>
                <td style="padding:8px 0;font-weight:600;width:120px;">Name</td>
                <td style="padding:8px 0;">${escapeHtml(data.name)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:600;">Email</td>
                <td style="padding:8px 0;">${escapeHtml(data.email)}</td>
              </tr>
              ${data.company ? `
              <tr>
                <td style="padding:8px 0;font-weight:600;">Company</td>
                <td style="padding:8px 0;">${escapeHtml(data.company)}</td>
              </tr>` : ``}
              ${prettyPhone ? `
              <tr>
                <td style="padding:8px 0;font-weight:600;">Phone</td>
                <td style="padding:8px 0;">${escapeHtml(prettyPhone)}</td>
              </tr>` : ``}
              ${data.subject ? `
              <tr>
                <td style="padding:8px 0;font-weight:600;">Subject</td>
                <td style="padding:8px 0;">${escapeHtml(data.subject)}</td>
              </tr>` : ``}
            </tbody>
          </table>

          <div style="padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;">
            <div style="font-weight:600;margin-bottom:8px;">Message</div>
            <div style="white-space:pre-wrap;line-height:1.5;">${escapeHtml(data.message)}</div>
          </div>
        </div>
      </div>
    `.trim();

    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: data.email,
      subject: data.subject || `New message from ${data.name}`,
      text: textLines.join("\n"),
      html,
      envelope: {
        from: SMTP_USER,
        to: EMAIL_TO,
      },
    });

    //Log inquiries for stats
    await sql`
      INSERT INTO inquiries (name, email, subject, message)
      VALUES (${data.name}, ${data.email}, ${data.subject || ""}, ${data.message})
    `;

    return res.status(200).json({
      success: true,
      message: "Your message has been sent.",
      id: info.messageId,
    });
  } catch (err) {
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

// --- 404 Handler ---
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// --- Central Error Handler ---
app.use((err, req, res, next) => {
  const isSyntaxError = err instanceof SyntaxError && "body" in err;
  const status = err.status || (isSyntaxError ? 400 : 500);
  const message = isSyntaxError ? "Invalid JSON" : (err.message || "Internal server error");

  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  res.status(status).json({ ok: false, error: message });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`SOGAS backend listening on http://localhost:${PORT}`);
});

// --- Escape HTML Helper ---
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
