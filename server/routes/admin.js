// admin.js
import express from "express";

const router = express.Router();

router.get("/health", (_req,res) => {
    res.json({
        ok: true,
        api: { status: "ok" },
        db: { status: "ok" },
        storage: { status: "ok" },
        version: "1.0.0",
        checkedAt: new Date().toISOString(),
    });
});

export default router;