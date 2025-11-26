// server/db/database.js
import postgres from "postgres";

const raw = process.env.DATABASE_URL;
if (!raw) throw new Error("DATABASE_URL is not set");

const url = new URL(raw);


const host = url.hostname;
const port = Number(url.port || 5432);

console.log("[DB TARGET]", {
  host,
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
  idle_timeout: 60,
  connect_timeout: 8,
  prepare: false,
});

export default sql;
