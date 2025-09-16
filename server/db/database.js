// database.js

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// Initialize connection
const sql = postgres(connectionString, {
  ssl: "require",
});

export default sql;
