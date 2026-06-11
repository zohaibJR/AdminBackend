import express from "express";

import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getNextSessionNo,
} from "../controller/sessionController.js";

const router = express.Router();

router
  .route("/")
  .post(createSession)
  .get(getAllSessions);

// Must be before /:id
router.get("/next-session-no/:clientId", getNextSessionNo);

router
  .route("/:id")
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

export default router;