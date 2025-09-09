import express from "express";
import { db } from "../db/database.js";

const router = express.Router();

// GET /api/info
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM site_info LIMIT 1");
        if (rows.length === 0) {
            return res.status(404).json({ error: "Site info not found" });
        }
        res.json(rows[0]);

    } catch (err) {
        console.error("Error fetching site info", err);
        res.status(500).json({ error: "Failed to load site info" });
    }
});

// PUT /api/info
router.put('/', async (req, res) => {
    const {
        tagline,
        mission_title,
        mission_description,
        about_description,
        phone,
        address,
    } = req.body;

    try {
        const [rows] = await db.query("SELECT id FROM site_info LIMIT 1");

        if (rows.length === 0) {

            // insert new row if one doesnt exist
            await db.query(
                `INSERT INTO site_info
                    (tagline, mission_title, mission_description, about_description, phone, address)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [tagline, mission_title, mission_description, about_description, phone, address]
            );
        } else {

            // update exisiting row
            const id = rows[0].id;
            await db.query(
                `UPDATE site_info SET
                    tagline = ?,
                    mission_title = ?,
                    mission_description = ?,
                    about_description = ?,
                    phone = ?,
                    address = ?
                WHERE id = ?`,
                [tagline, mission_title, mission_description, about_description, phone, address, id]
            );
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating site info:", err);
        res.status(500).json({ error: "Failed to update site info" });
    }
});

export default router;