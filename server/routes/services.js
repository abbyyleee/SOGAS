// services.js

import express from "express";
import { db } from "../db/database.js";

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM services");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Active services
router.get("/active", (req, res) => {
    db.query("SELECT * FROM services WHERE status = 'Active'", (err, results) => {
        if (err) return res.status(500).json({ error: err });
    });
});

// POST a new service
router.post("/", async (req, res) => {
  const { title, description, status } = req.body;
  const sql = "INSERT INTO services (title, description, status) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(sql, [title, description, status]);
    res.status(201).json({ message: "Service Added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (edit) a service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    await db.query(
      "UPDATE services SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, id]
    );

    res.json({ message: "Service Updated", id, status });

  } catch (err) {
    console.error("Error in PUT /services/:id:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// DELETE a service
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM services WHERE id=?", [id]);
    res.json({ message: "Service Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
