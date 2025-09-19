// api.js

import axios from "axios";

const api = axios.create({
    baseURL: "https://sogas-backend.onrender.com/api",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;