import express from "express";

import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getTodaysSessionsCount,
} from "../controller/sessionController.js";

const router = express.Router();

// Dashboard Routes
router.get("/today/count", getTodaysSessionsCount);

// Session CRUD Routes
router
  .route("/")
  .post(createSession)
  .get(getAllSessions);

router
  .route("/:id")
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

export default router;