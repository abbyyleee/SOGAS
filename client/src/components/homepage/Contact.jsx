// src/components/homepage/Contact.jsx
import { useState } from "react";
import { motion } from "framer-motion";

// Only Keep digits for Phone#
function onlyDigits(str) {
  return String(str || "").replace(/\D/g, "");
}

// Auto Format Phone#: (xxx)-xxx-xxxx
function formatPhoneForDisplay(raw) {
  const d = onlyDigits(raw).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a ? `(${a}` : "";
  if (d.length <= 6) return `(${a})-${b}`;
  return `(${a})-${b}-${c}`;
}

export default function Contact() {
  // ---- Form State ----
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  // Status Banner: idle | loading | success | error
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Special onChange for phone: store digits; display formatted
  function onChangePhone(e) {
    const digits = onlyDigits(e.target.value).slice(0, 10);
    setForm((f) => ({ ...f, phone: digits }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email";
    if (!form.message.trim()) errors.message = "Message is required";
    if (form.company && form.company.length > 150) errors.company = "Company too long";
    if (form.subject && form.subject.length > 150) errors.subject = "Subject too long";
    if (form.phone && form.phone.length > 30) errors.phone = "Phone too long";
    if (form.message && form.message.length > 5000) errors.message = "Message too long";
    return errors;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length) {
      const first =
        errors.name || errors.email || errors.message || Object.values(errors)[0];
      setStatus({ type: "error", message: first });
      return;
    }

    setStatus({ type: "loading", message: "Sending…" });

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          // Optional Fields
          company: form.company.trim() || undefined,
          phone: form.phone.trim() || undefined, // <- digits only
          subject: form.subject.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          (data && data.errors && Object.values(data.errors)[0]) ||
          (data && data.message) ||
          "Unable to send your message.";
        setStatus({ type: "error", message: msg });
        return;
      }

      setStatus({ type: "success", message: "Message sent. We’ll be in touch!" });
      setForm({
        name: "",
        company: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <section
      id="contact"
      className="relative w-full bg-deep-blue py-16 px-6 flex justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-col md:flex-row"
      >
        {/* LEFT — Get In Touch */}
        <div className="w-full md:w-1/2 bg-gray p-10 md:p-12 flex flex-col justify-start text-dark-navy">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Get In Touch
            </h2>
            <span className="block h-1 w-20 rounded-full bg-rust mt-3" />
            <p className="mt-4 leading-relaxed font-semibold">
              Questions, quotes, or emergency service — we’re ready to help.
            </p>

            <ul className="mt-8 space-y-6 font-semibold">
              <InfoItem
                title="Head Office"
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                  </svg>
                }
              >
                4565 Cypress Street Suite 110-2
                <br />
                West Monroe, LA 71291
              </InfoItem>

              <InfoItem
                title="Email"
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 5.2-9.2 5.75a2 2 0 0 1-2.1 0L1.5 9.2V18a2 2 0 0 0 2 2h17a 2 2 0 0 0 2-2V9.2Z" />
                  </svg>
                }
              >
                <span className="select-all">notices@sogassservices.com</span>
              </InfoItem>

              <InfoItem
                title="Phone"
                icon={
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.37 12 12 0 0 0 3.77.6 1.5 1.5 0 0 1 1.5 1.5V20a2 2 0 0 1-2 2A18 18 0 0 1 2 6a2 2 0 0 1 2-2h2.07A1.5 1.5 0 0 1 7.6 5.5a12 12 0 0 0 .6 3.77 1.5 1.5 0 0 1-.37 1.53l-1.23 1.99Z" />
                  </svg>
                }
              >
                (318) 355-4443
                <br />
              </InfoItem>
            </ul>
          </div>
        </div>

        {/* RIGHT — Send Us a Message */}
        <div className="w-full md:w-1/2 bg-light-blue p-10 md:p-12 flex flex-col justify-start">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-dark-navy tracking-tight">
              Send Us a Message
            </h3>
            <span className="block h-1 w-20 rounded-full bg-rust mt-3" />
            <p className="mt-4 text-dark-navy font-semibold">
              Fill out the form and we’ll respond quickly. <br/>
              * Marks Required Fields
            </p>

            {/* Status banner */}
            {status.type !== "idle" && (
              <div
                className={
                  "mt-4 rounded-md border p-3 text-sm " +
                  (status.type === "loading"
                    ? "border-reg-blue/40 bg-white/60"
                    : status.type === "success"
                    ? "border-green-600/30 bg-green-50 text-green-700"
                    : "border-red-600/30 bg-red-50 text-red-700")
                }
              >
                {status.message}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-dark-navy"
            >
              <Field
                id="name"
                name="name"
                label="Name"
                placeholder="Name"
                value={form.name}
                onChange={onChange}
                required
              />
              <Field
                id="company"
                name="company"
                label="Company"
                placeholder="Company"
                value={form.company}
                onChange={onChange}
              />
              <Field
                id="phone"
                name="phone"
                label="Phone Number"
                placeholder="Phone Number"
                value={formatPhoneForDisplay(form.phone)}
                onChange={onChangePhone}
              />
              <Field
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                required
              />
              <div className="md:col-span-2">
                <Field
                  id="subject"
                  name="subject"
                  label="Subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={onChange}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  id="message"
                  name="message"
                  label="Message"
                  placeholder="Message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="md:col-span-2 mt-2 flex justify-end">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  type="submit"
                  disabled={status.type === "loading"}
                  className="inline-flex items-center gap-2 rounded-md bg-rust px-6 py-3 font-semibold text-dark-navy shadow-md hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-rust/60 disabled:opacity-60"
                >
                  {status.type === "loading" ? "Sending…" : "Send"}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- UI Primitives ---------- */
function Field({ id, name, label, placeholder, type = "text", value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-dark-navy">
        {label} {required ? "*" : null}
      </label>
      <input
        id={id}
        name={name || id}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-light-blue/60 bg-white p-3 placeholder:text-deep-blue/50 outline-none focus:ring-2 focus:ring-rust/60 focus:border-rust/60 transition"
      />
    </div>
  );
}

function Textarea({ id, name, label, placeholder, rows = 5, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-dark-navy">
        {label} {required ? "*" : null}
      </label>
      <textarea
        id={id}
        name={name || id}
        rows={rows}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-md border border-light-blue/60 bg-white p-3 placeholder:text-deep-blue/50 outline-none focus:ring-2 focus:ring-rust/60 focus:border-rust/60 resize-none transition"
      />
    </div>
  );
}

function InfoItem({ title, icon, children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-dark-navy">
        {icon}
      </span>
      <div>
        <h4 className="font-extrabold text-dark-navy">{title}</h4>
        <p className="text-dark-navy">{children}</p>
      </div>
    </li>
  );
}

function Badge({ title, subtitle }) {
  return (
    <div className="rounded-lg border border-rust bg-white p-4">
      <p className="font-semibold text-dark-navy">{title}</p>
      <p className="text-deep-blue/80">{subtitle}</p>
    </div>
  );
}
