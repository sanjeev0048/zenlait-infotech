import express from "express";
import Contact from "../models/Contact.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware for admin protected route inside router
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    next();
  });
};

// Public: Submit enquiry
router.post("/submit", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ success: true, message: "Message Sent Successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

// Admin Only: Fetch enquiries
router.get("/", adminAuth, async (req, res) => {
  try {
    const msgs = await Contact.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;
