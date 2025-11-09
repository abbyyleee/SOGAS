// health.js
import express from "express";
import sql from "../db/database.js";

const router = express.Router();

router.get("/", async (_req,res) => {
    try {

        // ping to DB
        await sql`select 1`;
        res.json({ ok: true });

    } catch (e) {
        res.status(500).json({ ok: false, error: "db" });
    }
});

export default router;