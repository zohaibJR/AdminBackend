import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  sessionDate: { type: Date, required: true }, // Normalized to YYYY-MM-DD at 00:00:00
  sessionTime: { type: String, required: true }, // e.g., "10:00 AM" or "14:00"
  sessionType: { type: String, enum: ["Online", "InPerson"], default: "Online" },
  
  // Financial Tracking Variables
  sessionPayment: { type: Number, required: true, min: 0 }, // Total paid by client
  myShareAmount: { type: Number, required: true, min: 0 },   // SafeSpace platform cut
  therapistShare: { type: Number, required: true, min: 0 },  // Payout due to therapist
  
  // Flow Statuses
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Done", "Cancelled"], 
    default: "Pending" 
  },
  paymentReceived: { type: Boolean, default: false },
  didIReceiveMyShare: { type: Boolean, default: false } // Tracks platform settlement
}, { timestamps: true });

// Prevent double-booking at the database layer
sessionSchema.index({ therapistId: 1, sessionDate: 1, sessionTime: 1 }, { unique: true });

export default mongoose.model("Session", sessionSchema);