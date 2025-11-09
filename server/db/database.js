// server/db/database.js
import postgres from "postgres";
import dns from "node:dns/promises";

const raw = process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");

const url = new URL(raw);

// IPv4 resolve
let host = url.hostname;
try {
  const A = await dns.resolve4(url.hostname);
  if (A?.length) host = A[0];
} catch {}


const parsedPort = Number(url.port || 5432);
const port = parsedPort === 6543 ? 5432 : parsedPort;

console.log("[DB TARGET]", {
  originalHost: url.hostname,
  chosenHost: host,
  port,
  database: url.pathname.slice(1),
  user: decodeURIComponent(url.username),
  sslmode: url.searchParams.get("sslmode") || "require",
});

const sql = postgres({
  host,
  port,
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
