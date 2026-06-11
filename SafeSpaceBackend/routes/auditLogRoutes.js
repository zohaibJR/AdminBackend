import express from "express";
import { getAuditLogs, clearAuditLogs } from "../controller/auditLogController.js";

const router = express.Router();

router.route("/").get(getAuditLogs);
router.delete("/clear", clearAuditLogs);

export default router;