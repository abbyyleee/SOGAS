// apiBase.js
import axios from "axios";

const BASE = 
    import.meta.env.VITE_API_URL ||
    (location.hostname === "localhost" ? "http://localhost:3000" : "http://sogas-backend.onrender.com");

// Expose for quick debugging
if (typeof window !== "undefined") window.__API_BASE__ = BASE;

/* -------------------- AXIOS (all instances) -------------------- */
// Default base for relative axios URLs
axios.defaults.baseURL = BASE;

// Intercept every axios request (global axios)
axios.interceptors.request.use((config) => {
  if (typeof config.url === "string") {
    let url = config.url;

    // Rewrite hardcoded localhost/127.0.0.1
    if (url.startsWith("http://localhost:3000/")) {
      url = url.replace("http://localhost:3000", BASE);
    } else if (url.startsWith("http://127.0.0.1:3000/")) {
      url = url.replace("http://127.0.0.1:3000", BASE);
    } else if (url.startsWith("/api")) {
      url = `${BASE}${url}`;
    }

    config.url = url;
  }
  return config;
});

/* ----------------------- fetch() shim -------------------------- */
const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  let url = typeof input === "string" ? input : input.url;

  if (url.startsWith("http://localhost:3000/")) {
    url = url.replace("http://localhost:3000", BASE);
  } else if (url.startsWith("http://127.0.0.1:3000/")) {
    url = url.replace("http://127.0.0.1:3000", BASE);
  } else if (url.startsWith("/api")) {
    url = `${BASE}${url}`;
  }

  if (typeof input !== "string") {
    input = new Request(url, input);
    return originalFetch(input, init);
  }
  return originalFetch(url, init);
};


// This catches axios instances created elsewhere with hardcoded URLs
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
  let newUrl = url;
  if (typeof url === "string") {
    if (url.startsWith("http://localhost:3000/")) {
      newUrl = url.replace("http://localhost:3000", BASE);
    } else if (url.startsWith("http://127.0.0.1:3000/")) {
      newUrl = url.replace("http://127.0.0.1:3000", BASE);
    } else if (url.startsWith("/api")) {
      newUrl = `${BASE}${url}`;
    }
  }
  return originalOpen.call(this, method, newUrl, async, user, password);
};
