import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  specialization: [String],
  baseFee: { type: Number, required: true, min: 0 }, // Fee charged per session
  platformCommissionRate: { type: Number, default: 0.20 }, // 20% SafeSpace cut
  status: { type: String, enum: ["Active", "OnLeave", "Suspended"], default: "Active" }
}, { timestamps: true });

export default mongoose.model("Therapist", therapistSchema);