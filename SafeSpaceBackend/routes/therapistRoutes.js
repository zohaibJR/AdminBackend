import express from "express";

import {
  createTherapist,
  getAllTherapists,
  getDeletedTherapists,
  deleteTherapist,
  getTherapistById,
  updateTherapist,
  restoreTherapist,
} from "../controller/therapistController.js";

const router = express.Router();

router.route("/")
  .post(createTherapist)
  .get(getAllTherapists);

// Must be before /:id to avoid route conflict
router.get("/deleted", getDeletedTherapists);

router
  .route("/:id")
  .get(getTherapistById)
  .put(updateTherapist)
  .delete(deleteTherapist);

router.patch("/:id/restore", restoreTherapist);

export default router;