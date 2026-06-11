import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Therapist name is required"],
      trim: true,
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;