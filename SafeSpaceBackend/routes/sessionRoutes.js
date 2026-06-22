import express from "express";

import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getNextSessionNumber,
} from "../controller/sessionController.js";

const router = express.Router();

router
  .route("/")
  .post(createSession)
  .get(getAllSessions);

router.get(
  "/next-session-number/:clientId",
  getNextSessionNumber
);

router
  .route("/:id")
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

export default router;