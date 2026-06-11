import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CLIENT_CREATED",
        "CLIENT_UPDATED",
        "CLIENT_DELETED",
        "CLIENT_RESTORED",
        "THERAPIST_CREATED",
        "THERAPIST_UPDATED",
        "THERAPIST_DELETED",
        "THERAPIST_RESTORED",
        "SESSION_CREATED",
        "SESSION_UPDATED",
        "SESSION_DELETED",
        "SESSION_STATUS_CHANGED",
        "SESSION_PAYMENT_UPDATED",
      ],
    },

    entity: {
      type: String,
      required: true,
      enum: ["Client", "Therapist", "Session"],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    entityName: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    performedBy: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;