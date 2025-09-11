import express from "express";
import { db } from "../db/database.js";

const router = express.Router();

// Prevent double inserts
let lastLogged = null;

/**
 * POST /api/site_visits
 * Logs new site visits
 */
router.post("/", async (req, res) => {
    try {
        const ip = req.ip;
        const user = req.headers["user_agent"];
        const key = `${ip}-${user}`;

        // Prevent duplicate log
        if (lastLogged === key) {
            return res.json({ success: true, skipped: true });
        }
        lastLogged = key;

        await db.query(
            "INSERT INTO site_visits (ip, user_agent) VALUES (?, ?)",
            [ip, user]
        );
        
        console.log("visit logged:", ip, user);
        res.json({ success: true });

    } catch (err) {
        console.error("Error logging site visit:", err);
        res.status(500).json({ success: false });
    }
});

/**
 * GET /api/site_visits/stats
 * Returns site visits and inquiries from the past 7 days
 */
router.get("/stats", async (req, res) => {
    try {
        // Count visits
        const [visitsRow] = await db.query(
            "SELECT COUNT(*) AS visits7d FROM site_visits WHERE visited_at >= NOW() - INTERVAL 7 DAY"
        );

        // Count inquires
        const [inquiriesRow] = await db.query(
            "SELECT COUNT(*) AS inquiries7d FROM inquiries WHERE created_at >= NOW() - INTERVAL 7 DAY"
        );

        res.json({
            visits7d: visitsRow[0].visits7d,
            inquiries7d: inquiriesRow[0].inquiries7d,
        });

    } catch (err) {
        console.error("Error fetching site visit stats:", err);
        res.status(500).json({ visits7d: null, inquiries7d: null });
    }
});

export default router;