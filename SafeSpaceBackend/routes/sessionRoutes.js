import express from "express";
import { bookSession, processSessionPayment, cancelSession } from "../controllers/sessionController.js";

const router = express.Router();

// Base Transactional Endpoint Declarations
router.post("/book", bookSession);
router.patch("/:sessionId/pay", processSessionPayment);
router.patch("/:sessionId/cancel", cancelSession);

export default router;