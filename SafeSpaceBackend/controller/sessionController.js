import Session from "../models/session.js";

const getSessionPaymentFields = (sessionData) => {
  const charges = Number(sessionData.charges) || 0;
  const paymentReceived = Boolean(sessionData.paymentReceived);
  const stageByStatus = {
    Pending: "Session Pending",
    Done: "Session Done",
    Cancelled: "Session Cancelled",
    Refunded: "Session Refunded",
  };

  if (sessionData.status !== "Done") {
    return {
      sessionStage: stageByStatus[sessionData.status] || "Session Pending",
      sessionPayment: 0,
      myShareAmount: 0,
      paymentStatus: "No Payment",
      paymentReceived: false,
      didIReceiveMyShare: false,
    };
  }

  return {
    sessionStage: "Session Done",
    sessionPayment: charges,
    myShareAmount: charges * 0.2,
    paymentStatus: paymentReceived ? "Payment Received" : "Payment Pending",
    paymentReceived,
    didIReceiveMyShare: paymentReceived
      ? Boolean(sessionData.didIReceiveMyShare)
      : false,
  };
};

export const createSession = async (req, res) => {
  try {
    const sessionPayload = {
      ...req.body,
      ...getSessionPaymentFields(req.body),
    };

    const session = await Session.create(sessionPayload);

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("clientId", "name")
      .populate("therapistId", "name")
      .sort({ sessionDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const currentSession = await Session.findById(req.params.id);

    if (!currentSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const nextSession = {
      ...currentSession.toObject(),
      ...req.body,
    };

    const updatePayload = {
      ...req.body,
      ...getSessionPaymentFields(nextSession),
    };

    await Session.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      {
        new: true,
      }
    );

    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
