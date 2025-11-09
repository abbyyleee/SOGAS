import express from "express";
import sql from "../db/database.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await sql`SELECT * FROM services ORDER BY id ASC`;
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET Active services
router.get("/active", async (req, res) => {
  try {
    const activeServices = await sql`
      SELECT * FROM services WHERE status = 'Active'
    `;
    res.json(activeServices);
  } catch (err) {
    console.error("Error fetching active services:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST a new service
router.post("/", async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const [newService] = await sql`
      INSERT INTO services (title, description, status)
      VALUES (${title}, ${description}, ${status})
      RETURNING *
    `;
    res.status(201).json({ message: "Service Added", service: newService });
  } catch (err) {
    console.error("Error adding service:", err);
    res.status(500).json({ error: "Failed to add service" });
  }
});

// PUT (edit) a service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const [updatedService] = await sql`
      UPDATE services
      SET title = ${title}, description = ${description}, status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    res.json({ message: "Service Updated", service: updatedService });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

// DELETE a service
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM services WHERE id = ${id}`;
    res.json({ message: "Service Deleted" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
