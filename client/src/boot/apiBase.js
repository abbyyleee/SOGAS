// apiBase.js

import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = BASE;

if (typeof window !== "undefined") window.__API_BASE__ = BASE;

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
    let url = typeof input === "string" ? input : input.url;

    if (url.startsWith("http://localhost:3000/")) {
        url = url.replace("http://localhost:3000", BASE);

    } else if (url.startsWith("/api")) {
        url = `${BASE}${url}`;
    }

    if (typeof input !== "string") {
        input = new Request(url, input);
        return originalFetch(input, init);
    }

    return originalFetch(url, init);
};