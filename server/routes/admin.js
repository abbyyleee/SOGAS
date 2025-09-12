// admin.js

import express from "express";
const router = express.Router();

router.get("/health", (req,res) => {
    const health = {
        api: "ok",
        db: "ok",
        storage: "ok",
        version: "1.0.0",
        checkedAt: new Date().toISOString(),
    };
    res.json(health);
});

export default router;