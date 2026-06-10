import dotenv from "dotenv";

import connectDB from "./config/db.js";
import Session from "./models/session.js";

dotenv.config();

const seedSession = async () => {
  try {
    await connectDB();

    await Session.create({
      clientId: "PUT_CLIENT_ID_HERE",
      therapistId: "PUT_THERAPIST_ID_HERE",
      sessionNo: 1,
      sessionDate: "2026-06-15",
      sessionTime: "10:00 AM",
      sessionType: "Online",
      charges: 5000,
      status: "Pending",
      notes: "First session",
    });

    console.log("✅ Session added successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting session:", error);

    process.exit(1);
  }
};

seedSession();