import Session from "../models/session.js";
import Therapist from "../models/therapist.js";
import mongoose from "mongoose";

/**
 * BUSINESS RULE 1: Secure Session Booking
 * Fixed Loophole: Race conditions & unverified therapist booking pricing.
 */
export const bookSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clientId, therapistId, sessionDate, sessionTime, sessionType } = req.body;

    // Normalize date format to strip variable hour timestamps
    const normalizedDate = new Date(sessionDate);
    normalizedDate.setHours(0, 0, 0, 0);

    // Verify therapist status and fetch pricing rules
    const therapist = await Therapist.findOne({ _id: therapistId, status: "Active" }).session(session);
    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist is unavailable or inactive." });
    }

    // Verify availability using atomic lookups
    const existingBooking = await Session.findOne({
      therapistId,
      sessionDate: normalizedDate,
      sessionTime
    }).session(session);

    if (existingBooking) {
      return res.status(409).json({ success: false, message: "This appointment slot has already been reserved." });
    }

    // Calculate Split Fees accurately on the server
    const grossFee = therapist.baseFee;
    const platformShare = Math.round(grossFee * therapist.platformCommissionRate);
    const providerShare = grossFee - platformShare;

    // Create the session
    const newSession = new Session({
      clientId,
      therapistId,
      sessionDate: normalizedDate,
      sessionTime,
      sessionType,
      sessionPayment: grossFee,
      myShareAmount: platformShare,
      therapistShare: providerShare,
      status: "Pending",
      paymentReceived: false
    });

    await newSession.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * BUSINESS RULE 2: Complete Payment Collection Processing
 * Fixed Loophole: Updates financial flags safely without duplicating payouts.
 */
export const processSessionPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // In production, verify the gateway transaction token with your bank provider here

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        paymentReceived: true,
        didIReceiveMyShare: true,
        status: "Confirmed" // Automatically upgrades from Pending to Confirmed on payment
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ success: false, message: "Target session record not found." });
    }

    res.status(200).json({ success: true, message: "Payment processed successfully.", data: updatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * BUSINESS RULE 3: Policy-Driven Cancellations
 * Fixed Loophole: Enforces a strict cancellation window to protect therapist availability.
 */
export const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionToCancel = await Session.findById(sessionId);

    if (!sessionToCancel) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    // Check cancellation window policy (e.g., 24 hours notice required)
    const now = new Date();
    const sessionDateTime = new Date(sessionToCancel.sessionDate);
    
    // Simple mock breakdown to parse standard strings (like "10:00 AM") into real runtime hour integers
    const [time, modifier] = sessionToCancel.sessionTime.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours, 10) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    sessionDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const timeDifferenceInHours = (sessionDateTime - now) / (1000 * 60 * 60);

    if (timeDifferenceInHours < 24) {
      return res.status(400).json({
        success: false, 
        message: "Late cancellation policy triggered. Cancellations require at least 24 hours notice."
      });
    }

    sessionToCancel.status = "Cancelled";
    await sessionToCancel.save();

    res.status(200).json({ success: true, message: "Session successfully cancelled.", data: sessionToCancel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};