import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
    },

    specialization: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
    },

    phone: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Client name is required"],
        trim: true,
        lowercase: true,
    },
    },
    {
        timestamps: true,
    }
);

const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;