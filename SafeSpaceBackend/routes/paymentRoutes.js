import express from "express";
import {
  getPendingClientPayments,
  getPendingMyShare,
  markClientPaymentReceived,
  markMyShareReceived,
} from "../controller/paymentController.js";

const router = express.Router();

router.get("/pending-client", getPendingClientPayments);
router.get("/pending-share", getPendingMyShare);

router.patch("/client-paid/:id", markClientPaymentReceived);
router.patch("/share-received/:id", markMyShareReceived);

export default router;