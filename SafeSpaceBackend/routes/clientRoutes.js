import express from "express";
import { createClient } from "../controller/clientController.js";

const router = express.Router();

router.post("/addclient", createClient);

export default router;