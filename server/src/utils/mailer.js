import nodemailer from 'nodemailer';

export function buildTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = (process.env.SMTP_SECURE === 'true') || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    requireTLS: !secure,
    family: 4,
    tls: {
      servername: process.env.SMTP_HOST,
      rejectUnauthorized: true
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  });
}

export async function sendContactEmail({ name, email, subject, message }) {
  const transporter = buildTransporter();

  const mailOptions = {
    from: process.env.CONTACT_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO || process.env.EMAIL_TO || process.env.SMTP_USER,
    subject: subject ? `[Website] ${subject}` : '[Website] New Contact Form Message',
    replyTo: email,
    text: `
New message from your website:

Name: ${name}
Email: ${email}
Subject: ${subject || '(none)'}

Message:
${message}
    `,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>New message from your website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>
        <hr/>
        <p>${escapeHtml(message)}</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

export async function sendInviteEmail({ to, link }) {
  const transporter = buildTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.CONTACT_FROM || process.env.SMTP_USER,
    to,
    subject: "You're invited to join Southern Gas Services Admin Dashboard",
    text: `Click the link to set up your account: ${link}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Southern Gas Services Admin Invitation</h2>
        <p>You've been invited to join the admin dashboard.</p>
        <p><a href="${link}" style="font-weight:bold;">Click here to accept your invite</a></p>
        <p>This link will expire in 48 hours.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
