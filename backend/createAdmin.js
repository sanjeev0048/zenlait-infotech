import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    username: "admin",
    password: hashed,
  });

  await admin.save();
  console.log("Admin user created: username=admin, password=admin123");
  mongoose.connection.close();
}

createAdmin();
