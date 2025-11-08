// server/src/db/database.js
import postgres from "postgres";
import dns from "node:dns/promises";

/**
 * 1. Read connection string
 */
const raw = process.env.DATABASE_URL;
if (!raw) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * 2. Parse DATABASE_URL and prepare values
 */
const url = new URL(raw);

/**
 * 3. Try to resolve the hostname to IPv4 (avoid IPv6/ENETUNREACH issues)
 */
let host = url.hostname;
try {
  const A = await dns.resolve4(url.hostname);
  if (A?.length) host = A[0]; // pick first IPv4
} catch {
  // Fall back to original hostname if lookup fails
}

/**
 * 4. Diagnostic log: shows exactly where your backend is trying to connect
 */
try {
  console.log("[DB TARGET]", {
    originalHost: url.hostname,
    chosenHost: host,
    port: url.port || "5432 (default)",
    database: url.pathname?.slice(1),
    user: decodeURIComponent(url.username),
    sslmode: url.searchParams.get("sslmode") || "require",
  });
} catch (e) {
  console.log("[DB TARGET] could not parse DB URL:", e?.message);
}

/**
 * 5. Create Postgres client
 */
const sql = postgres({
  host,
  port: Number(url.port || 5432),
  username: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: "require",
  max: 10,
  idle_timeout: 30,
  connect_timeout: 30,
  prepare: false,
});

export default sql;
