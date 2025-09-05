import express from "express";
import multer from "multer";
import { cloudinary } from "../cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload_stream(
            {
                folder: "sogas-gallery",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return res.status(500).json({ error: "Upload failed" });
                }

                res.status(200).json({
                    success: true,
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        // Convert buffer to stream
        const streamifier = await import("streamifier");
        streamifier.default.createReadStream(file.buffer).pipe(result);

    } catch (err) {
        console.error("Server error during upload:", err);
        res.status(500).json({ error: "Server error "});
    }
});

export default router;