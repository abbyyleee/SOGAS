import nodemailer from 'nodemailer';

export function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendContactEmail({ name, email, subject, message }) {
  const transporter = buildTransporter();

  const mailOptions = {
    from: process.env.CONTACT_FROM,
    to: process.env.CONTACT_TO,
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

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
