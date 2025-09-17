// scripts/seedAdmin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../apps/api/src/models/Admin"; // Adjust path as needed

const MONGODB_URI = "mongodb://127.0.0.1:27017/webstoreDB"; // Your local DB URI

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected!");

    const username = "admin";
    const password = "changethispassword"; // IMPORTANT: Use a strong password

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      username,
      password: hashedPassword,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

seedAdmin();
