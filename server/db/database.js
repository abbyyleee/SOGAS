// database.js

// Imports
import postgres from "postgres";
import dns from "node:dns/promises";

// Env parsing
const url = new URL(process.env.DATABASE_URL);

// IPv4 resolution
let host = url.hostname;
try {
  const addrs = await dns.resolve4(url.hostname);
  if (addrs && addrs.length) host = addrs[0];
} catch { /* fall back to original hostname */ }

// Client
const sql = postgres({
  host,
  port: Number(url.port || 5432),
  username: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: "require",
});

// Export
export default sql;
