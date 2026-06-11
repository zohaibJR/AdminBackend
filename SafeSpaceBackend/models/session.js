import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },

    sessionNo: {
      type: Number,
      required: true,
    },

    sessionDate: {
      type: Date,
      required: true,
    },

    sessionTime: {
      type: String,
      required: true,
    },

    sessionType: {
      type: String,
      enum: ["Online", "Physical"],
      default: "Online",
    },

    charges: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Done", "Cancelled", "Refunded"],
      default: "Pending",
    },

    sessionStage: {
      type: String,
      enum: ["Session Pending", "Session Done", "Session Cancelled", "Session Refunded"],
      default: "Session Pending",
    },

    sessionPayment: {
      type: Number,
      default: 0,
      min: 0,
    },

    myShareAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["No Payment", "Payment Pending", "Payment Received"],
      default: "No Payment",
    },

    paymentReceived: {
      type: Boolean,
      default: false,
    },

    didIReceiveMyShare: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
