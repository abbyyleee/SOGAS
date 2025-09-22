// admin.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/health", authMiddleware, (req,res) => {
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