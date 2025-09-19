// Admin.jsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const OWNER_NAME = "Abby Lee";
const OWNER_EMAIL = "abbychrislee@gmail.com";
const OWNER_PHONE = "(318)-953-1464";

const API_BASE = import.meta.env.VITE_API_BASE || "https://sogas-backend.onrender.com";

/* Animations */
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};


/* Shared UI */
function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-white">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="mt-3 h-[1px] bg-deep-blue/40" />
    </div>
  );
}

function Badge({ tone = "neutral", children }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-500 text-deep-blue font-bold ring-1 ring-soft-blue/40"
      : tone === "warn"
      ? "bg-rust text-dark-navy font-bold ring-1 ring-rust/40"
      : "bg-light-blue/15 text-deep-blue ring-1 ring-light-blue/40";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <motion.div
      variants={cardVariants}
      className="rounded-2xl p-12 bg-light-blue text-dark-navy ring-1 ring-dark-navy/10 shadow-lg"
    >
      <div className="text-lg text-dark-navy">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-dark-navy">{value ?? "—"}</div>
      {hint && <div className="mt-2 text-sm text-dark-navy">{hint}</div>}
    </motion.div>
  );
}

/* Icons */
function IconServices() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 6v12M6 12h12" />
      <rect x="3" y="3" width="18" height="18" rx="4" className="opacity-60" />
    </svg>
  );
}
function IconGallery() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M8 13l2-2 3 3 3-4 2 3" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h2v4h-2z" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="3" y="3" width="13" height="13" rx="2" />
    </svg>
  );
}

export default function Admin() {

  /* Health */
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState("");
  const [copyOk, setCopyOk] = useState(false);

  /* Reports */
  const [stats, setStats] = useState({ visits7d: null, inquiries7d: null });
  console.log("API_BASE:", API_BASE);

  /* Key */
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("key");

    if (key !== "SoGas97") {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    let mounted = true;
    async function loadHealth() {
      try {
        setHealthError("");
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/health`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (mounted) setHealth(data);
      } catch {
        if (mounted) {
          setHealth(null);
          setHealthError("Unable to fetch health");
        }
      }
    }
    loadHealth();
    const id = setInterval(loadHealth, 60000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const globalStats = window.__SOGAS_STATS__;
    if (globalStats) setStats((s) => ({ ...s, ...globalStats }));
  }, []);

  /* Health helpers */
  const toneFrom = (v) => (v === "ok" ? "ok" : "warn");
  const textFrom = (v) => (v === "ok" ? "OK" : "Attention");
  const overallTone = (h) =>
    h && h.api === "ok" && h.db === "ok" && (h.storage === "ok" || h.storage == null) ? "ok" : "warn";

  async function copyIncidentNote() {
    const ts = new Date().toLocaleString("en-US", { hour12: true });
    const h = health;
    const note = `Health check: API=${h?.api ?? "unknown"}, DB=${h?.db ?? "unknown"}, Storage=${h?.storage ?? "unknown"} at ${ts} (version ${h?.version ?? "n/a"}).`;
    try {
      await navigator.clipboard.writeText(note);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch {}
  }

  // Fetch Stats
useEffect(() => {
  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/api/site_visits/stats`);
      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }
  fetchStats();
}, []);

  return (
    <div className="min-h-screen bg-deep-blue">

      {/* Top Bar */}
      <motion.header
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="sticky top-0 z-40 backdrop-blur-md bg-deep-blue/90 ring-1 ring-light-blue/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-deep-blue text-white grid place-items-center ring-1 ring-light-blue/40">
              <span className="text-lg font-bold">A</span>
            </div>
            <div>
              <div className="text-sm text-white">Southern Gas Services</div>
              <div className="text-lg font-semibold text-white">Admin Dashboard</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-white">
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* Site Health */}
        <section>
          <SectionHeader
            title="Site Health"
            subtitle="Read-only indicators. If something is wrong, contact support."
            right={
              <Badge tone={overallTone(health)}>
                {overallTone(health) === "ok" ? "All Systems Normal" : "Attention Needed"}
              </Badge>
            }
          />
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="rounded-2xl p-12 bg-light-blue text-dark-navy ring-1 ring-dark-navy/10 shadow-xl"
          >
            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <div className="text-lg text-dark-navy">API</div>
                <Badge tone={toneFrom(health?.api)}>{textFrom(health?.api)}</Badge>
              </div>
              <div>
                <div className="text-lg text-dark-navy">Database</div>
                <Badge tone={toneFrom(health?.db)}>{textFrom(health?.db)}</Badge>
              </div>
              <div>
                <div className="text-lg text-dark-navy">Storage</div>
                <Badge tone={toneFrom(health?.storage)}>{textFrom(health?.storage)}</Badge>
              </div>
              <div>
                <div className="text-lg text-dark-navy">Version</div>
                <div className="text-sm font-medium text-dark-navy">{health?.version ?? "—"}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="text-lg text-dark-navy">
                Last checked:{" "}
                <span className="text-dark-navy">
                  {health?.checkedAt
                    ? new Date(health.checkedAt).toLocaleString()
                    : healthError
                    ? "—"
                    : "Just now"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyIncidentNote}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-deep-blue hover:bg-rust hover:text-dark-navy text-white transition ring-1 ring-light-blue/30"
                >
                  <IconCopy />
                  <span className="text-sm">Copy incident note</span>
                </button>
                <AnimatePresence>
                  {copyOk && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-white text-sm"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {(overallTone(health) !== "ok" || healthError) && (
              <div className="mt-4 rounded-xl p-3 bg-rust ring-1 ring-rust/40">
                There may be a technical issue. Please contact{" "}
                <span className="font-semibold">{OWNER_NAME}</span> at{" "}
                <a href={`tel:${OWNER_PHONE.replace(/\D/g, "")}`} className="underline hover:no-underline">
                  {OWNER_PHONE}
                </a>{" "}
                or{" "}
                <a href={`mailto:${OWNER_EMAIL}`} className="underline hover:no-underline">
                  {OWNER_EMAIL}
                </a>
                .
              </div>
            )}
          </motion.div>
        </section>

        {/* Content Management */}
        <section>
          <SectionHeader title="Content Management" subtitle="Keep public site content up to date" />
          <div className="grid sm:grid-cols-3 gap-4">
            
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl p-12 bg-light-blue text-dark-navy ring-1 ring-dark-navy/10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-soft-blue/20 text-deep-blue grid place-items-center ring-1 ring-light-blue/30">
                  <IconServices />
                </div>
                <div>
                  <div className="font-semibold text-dark-navy">Services</div>
                  <div className="text-sm text-dark-navy">Add, edit, or remove offerings</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="/admin/services"
                  className="px-3 py-1.5 rounded-xl bg-deep-blue hover:bg-rust hover:text-dark-navy text-white transition ring-1 ring-light-blue/30 text-sm"
                >
                  Manage Services
                </a>
              </div>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl p-12 bg-light-blue text-dark-navy ring-1 ring-dark-navy/10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-soft-blue/20 text-deep-blue grid place-items-center ring-1 ring-light-blue/30">
                  <IconGallery />
                </div>
                <div>
                  <div className="font-semibold text-dark-navy">Gallery</div>
                  <div className="text-sm text-dark-navy">Upload and curate photos</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="/admin/gallery"
                  className="px-3 py-1.5 rounded-xl bg-deep-blue hover:bg-rust hover:text-dark-navy text-white transition ring-1 ring-light-blue/30 text-sm"
                >
                  Manage Gallery
                </a>
              </div>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-2xl p-12 bg-light-blue text-dark-navy ring-1 ring-dark-navy/10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-soft-blue/20 text-deep-blue grid place-items-center ring-1 ring-light-blue/30">
                  <IconInfo />
                </div>
                <div>
                  <div className="font-semibold text-dark-navy">Company Info</div>
                  <div className="text-sm text-dark-navy">Homepage info</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="/admin/info"
                  className="px-3 py-1.5 rounded-xl bg-deep-blue hover:bg-rust hover:text-dark-navy text-white transition ring-1 ring-light-blue/30 text-sm"
                >
                  Edit Company Info
                </a>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Reports / Stats */}
        <section>
          <SectionHeader title="Reports & Stats" subtitle="Weekly visits and inquires" />
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4 font-semibold"
          >
            <StatCard label="Site Visits (7d)" value={stats.visits7d} hint="User visits" />
            <StatCard label="Inquiries (7d)" value={stats.inquiries7d} hint="Contact submissions" />
          </motion.div>
        </section>

        {/* Footer */}
        <div className="py-6 text-center text-md text-white">
          Admin • Southern Gas Services
        </div>
      </main>
    </div>
  );
}
