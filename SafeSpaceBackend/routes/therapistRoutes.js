import express from "express";

import {
  createTherapist,
  getAllTherapists,
  deleteTherapist,
  getTherapistById,
  updateTherapist,
} from "../controller/therapistController.js";

const router = express.Router();

router.route("/")
  .post(createTherapist)
  .get(getAllTherapists);

router
  .route("/:id")
  .get(getTherapistById)
  .put(updateTherapist)
  .delete(deleteTherapist);

export default router;