import express from "express";

import {
  createClient,
  getAllClients,
  getDeletedClients,
  getClientById,
  updateClient,
  deleteClient,
  restoreClient,
} from "../controller/clientController.js";

const router = express.Router();

router
  .route("/")
  .post(createClient)
  .get(getAllClients);

// Must be before /:id to avoid route conflict
router.get("/deleted", getDeletedClients);

router
  .route("/:id")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

router.patch("/:id/restore", restoreClient);

export default router;