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
  const sql = "UPDATE services SET title=?, description=?, status=? WHERE id=?";

  try {
    await db.query(sql, [title, description, status, id]);
    res.json({ message: "Service Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
