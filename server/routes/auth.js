// auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "../db/database.js";

const router = express.Router();

// Register 
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Hash password
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user into DB
        const [user] = await sql `
            INSERT INTO users (email, password_hash, role)
            VALUES (${email}, ${passwordHash}, 'admin')
            RETURNING id, email, role, created_at`;
        
            res.status(201).json({ message: "Admin registered successfully", user });

    } catch (err) {
        console.error("Register eroor:", err);
        resizeTo.status(500).json({ error: "Server error" });
    }
});

export default router;