import Session from "../models/session.js";


// 1. All sessions where client still has pending payment
export const getPendingClientPayments = async (req, res) => {
  try {
    const sessions = await Session.find({
      status: "Done",
      paymentStatus: "Payment Pending",
    })
      .populate("clientId", "name")
      .populate("therapistId", "name")
      .sort({ sessionDate: -1 });

    const totalPending = sessions.reduce((acc, s) => acc + (s.sessionPayment || 0), 0);

    res.status(200).json({
      success: true,
      count: sessions.length,
      totalPendingClientPayment: totalPending,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// 2. All sessions where YOUR SHARE is still NOT received
export const getPendingMyShare = async (req, res) => {
  try {
    const sessions = await Session.find({
      status: "Done",
      paymentStatus: "Payment Received",
      didIReceiveMyShare: false,
    })
      .populate("clientId", "name")
      .populate("therapistId", "name")
      .sort({ sessionDate: -1 });

    const totalPendingShare = sessions.reduce(
      (acc, s) => acc + (s.myShareAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      count: sessions.length,
      totalPendingMyShare: totalPendingShare,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// 3. Mark client payment as received
export const markClientPaymentReceived = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.paymentReceived = true;
    session.paymentStatus = "Payment Received";

    await session.save();

    res.status(200).json({
      success: true,
      message: "Client payment marked as received",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// 4. Mark your share as received
export const markMyShareReceived = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.paymentReceived) {
      return res.status(400).json({
        message: "Client payment not received yet",
      });
    }

    session.didIReceiveMyShare = true;

    await session.save();

    res.status(200).json({
      success: true,
      message: "Your share marked as received",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};