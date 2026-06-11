import Session from "../models/session.js";
import AuditLog from "../models/auditLog.js";

// ── Helpers ──────────────────────────────────────────────────
const log = (action, session, description, changes = null) =>
  AuditLog.create({
    action,
    entity: "Session",
    entityId: session._id,
    entityName: `Session #${session.sessionNo}`,
    description,
    changes,
  }).catch(() => {});

const getSessionPaymentFields = (sessionData) => {
  const charges = Number(sessionData.charges) || 0;
  const paymentReceived = Boolean(sessionData.paymentReceived);
  const stageByStatus = {
    Pending:   "Session Pending",
    Done:      "Session Done",
    Cancelled: "Session Cancelled",
    Refunded:  "Session Refunded",
  };

  if (sessionData.status !== "Done") {
    return {
      sessionStage:      stageByStatus[sessionData.status] || "Session Pending",
      sessionPayment:    0,
      myShareAmount:     0,
      paymentStatus:     "No Payment",
      paymentReceived:   false,
      didIReceiveMyShare: false,
    };
  }

  return {
    sessionStage:      "Session Done",
    sessionPayment:    charges,
    myShareAmount:     charges * 0.2,
    paymentStatus:     paymentReceived ? "Payment Received" : "Payment Pending",
    paymentReceived,
    didIReceiveMyShare: paymentReceived ? Boolean(sessionData.didIReceiveMyShare) : false,
  };
};

// ── Get Next Session No for a Client ──────────────────────────
export const getNextSessionNo = async (req, res) => {
  try {
    const { clientId } = req.params;

    const count = await Session.countDocuments({ clientId });

    res.status(200).json({ nextSessionNo: count + 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Session ────────────────────────────────────────────
export const createSession = async (req, res) => {
  try {
    const sessionPayload = {
      ...req.body,
      ...getSessionPaymentFields(req.body),
    };

    const session = await Session.create(sessionPayload);

    const populated = await Session.findById(session._id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    await log(
      "SESSION_CREATED",
      session,
      `Session #${session.sessionNo} created for client "${populated?.clientId?.name || session.clientId}" with therapist "${populated?.therapistId?.name || session.therapistId}". Status: ${session.status}.`
    );

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Sessions ──────────────────────────────────────────
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("clientId", "name")
      .populate("therapistId", "name")
      .sort({ sessionDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Session By ID ─────────────────────────────────────────
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Session ────────────────────────────────────────────
export const updateSession = async (req, res) => {
  try {
    const currentSession = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    if (!currentSession) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const nextSession = { ...currentSession.toObject(), ...req.body };

    const updatePayload = {
      ...req.body,
      ...getSessionPaymentFields(nextSession),
    };

    // Build a readable changes summary for audit
    const changes = {};
    const trackFields = ["status", "charges", "sessionDate", "sessionTime", "sessionType", "paymentReceived", "didIReceiveMyShare"];
    for (const field of trackFields) {
      if (req.body[field] !== undefined && String(req.body[field]) !== String(currentSession[field])) {
        changes[field] = { from: currentSession[field], to: req.body[field] };
      }
    }

    await Session.findByIdAndUpdate(req.params.id, updatePayload, { new: true });

    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    // Pick the most descriptive action
    let action = "SESSION_UPDATED";
    if (changes.status)         action = "SESSION_STATUS_CHANGED";
    if (changes.paymentReceived || changes.didIReceiveMyShare) action = "SESSION_PAYMENT_UPDATED";

    const clientName    = session.clientId?.name   || "Unknown";
    const therapistName = session.therapistId?.name || "Unknown";

    await log(
      action,
      session,
      `Session #${session.sessionNo} (${clientName} / ${therapistName}) was updated.`,
      Object.keys(changes).length ? changes : null
    );

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Hard Delete Session ───────────────────────────────────────
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const clientName    = session.clientId?.name   || "Unknown";
    const therapistName = session.therapistId?.name || "Unknown";
    const sessionNo     = session.sessionNo;

    await Session.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      action:      "SESSION_DELETED",
      entity:      "Session",
      entityId:    session._id,
      entityName:  `Session #${sessionNo}`,
      description: `Session #${sessionNo} (${clientName} / ${therapistName}) was permanently deleted.`,
    }).catch(() => {});

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};