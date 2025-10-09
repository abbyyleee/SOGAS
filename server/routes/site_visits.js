// site_visits.js

import express from "express";
import sql from "../db/database.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Prevent double inserts
let lastLogged = null;

/**
 * POST /api/site_visits
 * Logs new site visits
 */
router.post("/", async (req, res) => {
    try {
        const ip = req.ip || null;
        const user = req.headers["user_agent"] || null;
        const key = `${ip}-${user}`;

        // Prevent duplicate log
        if (lastLogged === key) {
            return res.json({ success: true, skipped: true });
        }
        lastLogged = key;

        await sql`
            INSERT INTO site_visits (ip, user_agent)
            VALUES (${ip}, ${user})
        `;
        
        console.log("Visit logged:", ip, user);
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
        const visitsRow = await sql`
            SELECT COUNT(*)::int AS visits7d
            FROM site_visits
            WHERE visited_at >= NOW() - INTERVAL '7 days'
        `;

        // Count inquires
        const inquiriesRow = await sql`
            SELECT COUNT(*)::int AS inquiries7d
            FROM inquiries
            WHERE created_at >= NOW() - INTERVAL '7 days'
        `;

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
