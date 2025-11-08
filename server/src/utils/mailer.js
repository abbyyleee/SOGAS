// server/src/utils/mailer.js
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.warn("[Resend] RESEND_API_KEY is missing — emails will fail.");
}

const resend = new Resend(RESEND_API_KEY);

function safeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendWithFallback({ from, to, subject, html, text, replyTo }) {
  // Primary attempt: use configured From
  try {
    const r = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    });
    console.log("[Resend] primary ok:", r?.id, "to:", to);
    return r;
  } catch (e) {
    console.error("[Resend] primary failed:", e?.status, e?.message || e);
    // Fallback if domain not authorized
    if (e?.status === 403 || /unauthorized/i.test(String(e?.message))) {
      const r2 = await resend.emails.send({
        from: "Southern Gas Services <onboarding@resend.dev>",
        to,
        subject,
        html,
        text,
        reply_to: replyTo || from,
      });
      console.log("[Resend] fallback ok:", r2?.id, "to:", to);
      return r2;
    }
    throw e;
  }
}

export async function sendContactEmail({ name, email, subject, message }) {
  const from = process.env.EMAIL_FROM || "Southern Gas Services <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO || process.env.EMAIL_TO || process.env.SMTP_USER;

  const text =
`New contact form submission from Southern Gas Services website

Name: ${name}
Email: ${email}
Subject: ${subject || "(none)"}

Message:
${message}`;

  const html = `
    <div style="font-family:sans-serif;line-height:1.5;">
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${safeHtml(name)}</p>
      <p><strong>Email:</strong> ${safeHtml(email)}</p>
      <p><strong>Subject:</strong> ${safeHtml(subject || "(none)")}</p>
      <hr/>
      <div style="white-space:pre-wrap">${safeHtml(message)}</div>
    </div>
  `;

  return sendWithFallback({
    from,
    to,
    subject: subject ? `[Website] ${subject}` : "[Website] New Contact Form Message",
    html,
    text,
    replyTo: email,
  });
}

export async function sendInviteEmail({ to, link }) {
  const from = process.env.EMAIL_FROM || "Southern Gas Services <onboarding@resend.dev>";
  const subject = "You're invited to join Southern Gas Services Admin Dashboard";

  const text = `You're invited to the Southern Gas Services Admin Dashboard.

Accept your invite: ${link}

This link will expire in 48 hours.`;

  const html = `
    <div style="font-family:sans-serif;line-height:1.5;">
      <h2>Southern Gas Services Admin Invitation</h2>
      <p>You've been invited to join the admin dashboard.</p>
      <p><a href="${safeHtml(link)}" style="font-weight:bold;">Click here to accept your invite</a></p>
      <p style="word-break:break-all;">If the button doesn't work, copy/paste this link:<br>${safeHtml(link)}</p>
      <p>This link will expire in 48 hours.</p>
    </div>
  `;

  return sendWithFallback({ from, to, subject, html, text });
}
