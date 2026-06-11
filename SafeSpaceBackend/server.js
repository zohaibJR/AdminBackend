import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import clientRoutes from "./routes/clientRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Routes
app.use("/api/clients",    clientRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/sessions",   sessionRoutes);
app.use("/api/dashboard",  dashboardRoutes);
app.use("/api/audit-logs", auditLogRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();