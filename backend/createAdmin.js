// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  await Admin.updateOne(
    { username: "admin" },          // find admin
    { $set: { password: hashed } }, // update password only
    { upsert: true }                // create if not exist
  );

  console.log("Admin user created/updated: username=admin, password=admin123");
  mongoose.connection.close();
}

createAdmin();
