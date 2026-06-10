import express from "express";

import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from "../controller/sessionController.js";

const router = express.Router();

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