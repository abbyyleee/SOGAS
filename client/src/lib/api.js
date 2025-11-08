// src/lib/api.js
import axios from "axios";

/**
 * Accepts:
 *  - https://api.sogasservices.com
 *  - https://api.sogasservices.com/
 *  - https://api.sogasservices.com/api
 *  - https://api.sogasservices.com/api/
 */
function normalizeBase(raw) {
  const fallback = "https://api.sogasservices.com";
  let base = (raw || fallback).trim();

  // remove trailing slashes
  base = base.replace(/\/+$/, "");
  // ensure single /api suffix
  if (!/\/api$/i.test(base)) base = `${base}/api`;
  return base;
}

const BASE_URL = normalizeBase(import.meta.env.VITE_API_BASE);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

// Attach Authorization: Bearer <token> to every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Dev-only sanity log (ignored in production builds if you want)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("[api] baseURL =", BASE_URL);
}

export default api;

