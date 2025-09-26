// info.js
import express from "express";
import sql from "../db/database.js";
import authMiddleware from "../middleware/authMiddleware.js";  

const router = express.Router();

// GET /api/info
router.get("/", async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM site_info LIMIT 1`;
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
router.put('/', authMiddleware, async (req, res) => {
    const {
        tagline,
        mission_title,
        mission_description,
        about_description,
        phone,
        address,
    } = req.body;

    try {
        const rows = await sql`SELECT id FROM site_info LIMIT 1`;

        if (rows.length === 0) {

            // insert new row if one doesnt exist
            await sql`
                INSERT INTO site_info
                    (tagline, mission_title, mission_description, about_description, phone, address)
                VALUES
                    (${tagline}, ${mission_title}, ${mission_description}, ${about_description}, ${phone}, ${address})
            `;
        } else {

            // update exisiting row
            const id = rows[0].id;
            await sql`
                UPDATE site_info SET
                    tagline = ${tagline},
                    mission_title = ${mission_title},
                    mission_description = ${mission_description},
                    about_description = ${about_description},
                    phone = ${phone},
                    address = ${address}
                WHERE id = ${id}
            `;
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating site info:", err);
        res.status(500).json({ error: "Failed to update site info" });
    }
});

export default router;
