import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/admin.js";

dotenv.config();

mongoose.connect(process.env.DATABASE_URI);

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("Moteeba@SS", 10);

    await Admin.deleteMany();

    await Admin.create({
      username: "admin",
      password: hashedPassword,
    });

    console.log("Admin Seeded Successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();