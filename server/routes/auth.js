// auth.js
import express from "express";
import bcrypt from "bcryptjs";
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