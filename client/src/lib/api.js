// src/lib/api.js
import axios from "axios";

let base = import.meta.env.VITE_API_BASE || "";

if (base.endsWith("/")) base = base.slice(0, -1);

const api = axios.create({
  baseURL: `${base}/api`, 
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
