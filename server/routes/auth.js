// server/routes/auth.js
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
    if (!email) return res.status(400).json({ ok: false, error: "Email is required" });

    const requesterId = req.user?.id;
    const rows = await sql`
      SELECT can_invite
      FROM users
      WHERE id = ${requesterId}
      LIMIT 1;
    `;
    if (!rows?.[0]?.can_invite) {
      return res.status(403).json({ ok: false, error: "Permission not granted" });
    }

    const token = jwt.sign({ email, role: "pending" }, process.env.JWT_SECRET, { expiresIn: "48h" });

    const inviteLink = `https://www.sogasservices.com/admin/register?token=${token}`;

    await sendInviteEmail({ to: email, link: inviteLink });

    return res.json({ ok: true, message: "Invite sent successfully" });
  } catch (err) {
    console.error("Invite error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Profile (used to hide/show invite UI)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await sql`
      SELECT id, email, name, role, can_invite
      FROM users
      WHERE id = ${userId}
      LIMIT 1;
    `;
    if (!rows[0]) return res.status(404).json({ ok: false, error: "User not found" });
    return res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Accept Invite
router.post("/accept-invite", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ ok: false, error: "Token and password are required." });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid or expired invite token." });
    }

    const { email } = payload;
    const existing = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;

    const hashed = await bcrypt.hash(password, 10);

    if (existing.length > 0) {
      // If user existed without password, set it and promote to admin
      if (existing[0].password_hash) {
        return res.status(400).json({ ok: false, error: "User already registered." });
      }
      await sql`
        UPDATE users
        SET password_hash = ${hashed}, role = 'admin'
        WHERE email = ${email};
      `;
    } else {
      await sql`
        INSERT INTO users (email, password_hash, role)
        VALUES (${email}, ${hashed}, 'admin');
      `;
    }

    return res.json({ ok: true, message: "Account created successfully!" });
  } catch (err) {
    console.error("Accept-invite error:", err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;
    const user = result[0];
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash || "");
    if (!isMatch) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({ ok: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Register (manual admin creation)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ ok: false, error: "Email and password are required" });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const inserted = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'admin')
      RETURNING id, email, role, created_at;
    `;

    return res.status(201).json({
      ok: true,
      message: "Admin registered successfully",
      user: inserted[0]
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
