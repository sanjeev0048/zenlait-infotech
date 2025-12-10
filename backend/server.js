import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Admin from "./models/Admin.js";
import settingsRouter from "./routes/Settings.js";
import contactRouter from "./routes/Contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose
 mongoose.connect(process.env.MONGO_URI, { dbName: "zenelaitdb" })
.then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: "Invalid login" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ success: true, token });
});

// 📌 Contact routes (Submit = public, Fetch = admin only)
app.use("/api/contacts", contactRouter);

// Protected routes
app.use("/api/settings", authenticateToken, settingsRouter);

app.get("/", (req, res) =>
  res.json({ message: "Zenelait Backend Running 🚀" })
);

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
