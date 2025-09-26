// auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "../db/database.js";
import { sendInviteEmail } from "../src/utils/mailer.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Invite - Admin Only
router.post("/invite", authMiddleware, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ ok: false, error: "Email is required" });
        }

        // Create Token
        const token = jwt.sign({ email, role: "pending" }, process.env.JWT_SECRET, {
            expiresIn: "48h"
        });

        // Frontend Registration Link
        const inviteLink = `https://sogas-frontend.onrender.com/admin/register?token=${token}`;

        // Send Email
        await sendInviteEmail({ to: email, link: inviteLink });

        res.json({ ok: true, message: "Invite sent successfully" });

    } catch (err) {
        console.error("Invite error:", err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {

        // Find User By Email
        const result = await sql`SELECT * FROM users WHERE email = ${email}`;
        const user = result[0];

        if (!user) {
            return res.status(401).json({ ok: false, error: "Invalid credentials" });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ ok: false, error: "Invalid credentials" });
        }

        // Token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ ok: true, token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
});

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

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) {
            return res.status(400).json({ ok: false, error: "User not found" });
        }

        const user = users[0];

        // Compare Password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ ok: false, error: "Invalid password" });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ ok: true, token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ ok: false, error: "Sever error" });
    }
});

export default router;