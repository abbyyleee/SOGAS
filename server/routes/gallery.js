import express from "express";
import sql from "../db/database.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all gallery images
router.get("/", async (_req, res) => {
  try {
    const images = await sql`SELECT * FROM gallery ORDER BY created_at DESC`;
    res.json(images);
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPLOAD new image
router.post("/upload", authMiddleware, async (req, res) => {
  try {
    const { url, caption, public_id } = req.body;

    const [newImage] = await sql`
      INSERT INTO gallery (url, caption, public_id)
      VALUES (${url || null}, ${caption || null}, ${public_id || null})
      RETURNING *
    `;

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// UPDATE caption
router.put("/:public_id", authMiddleware, async (req, res) => {
  try {
    const { caption } = req.body;
    const { public_id } = req.params;

    const [updated] = await sql`
      UPDATE gallery
      SET caption = ${caption}
      WHERE public_id = ${public_id}
      RETURNING *
    `;

    res.json(updated);
  } catch (err) {
    console.error("Error updating caption:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE image
router.delete("/:public_id", authMiddleware, async (req, res) => {
  try {
    const { public_id } = req.params;

    await sql`
      DELETE FROM gallery
      WHERE public_id = ${public_id}
    `;

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
