// gallery.js

import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { cloudinary } from "../cloudinary.js";
import { db } from "../db/database.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        const { caption } = req.body;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });

        // Save to database
        const sql = "INSERT INTO gallery (url, public_id, caption) VALUES (?, ?, ?)";
        await db.query(sql, [result.secure_url, result.public_id, caption || ""]);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Upload failed" });
    }
});

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM gallery ORDER BY id DESC");
        res.json(rows);

    } catch (err) {
        console.error("Error fetching gallery:", err);
        res.status(500).json({ error: "Error fetching gallery" });
    }
});

router.delete("/:publicId", async (req, res) => {
    const { publicId } = req.params;

    try {
        await cloudinary.uploader.destroy(publicId);

        await db.query("DELETE FROM gallery WHERE public_id = ?", [publicId]);

        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting image:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

router.put("/:publicId", async (req, res) => {
    const { publicId } = req.params;
    const { caption } = req.body;

    try {
        await db.query("UPDATE gallery SET caption = ? WHERE public_id = ?", [caption, publicId]);
        res.json({ success: true });

    } catch (err) {
        console.error("Error updating caption:", err);
        res.status(500).json({ error: "Caption update failed" });
    }
});

export default router;