import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function safeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendWithFallback({ from, to, subject, html, text, replyTo }) {
  // Try your desired FROM (requires domain verification in Resend)
  try {
    const r = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    });
    return r;
  } catch (e) {
    // If domain not verified (403), retry via onboarding sender
    if (e?.status === 403 || /unauthorized/i.test(String(e?.message))) {
      return resend.emails.send({
        from: "Southern Gas Services <onboarding@resend.dev>",
        to,
        subject,
        html,
        text,
        reply_to: replyTo || from,
      });
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
      <p><a href="${link}" style="font-weight:bold;">Click here to accept your invite</a></p>
      <p>This link will expire in 48 hours.</p>
    </div>
  `;

  return sendWithFallback({ from, to, subject, html, text });
}
