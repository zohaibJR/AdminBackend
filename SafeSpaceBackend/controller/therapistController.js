import Therapist from "../models/therapist.js";
import AuditLog from "../models/auditLog.js";

// ── Helpers ──────────────────────────────────────────────────
const log = (action, therapist, description, changes = null) =>
  AuditLog.create({
    action,
    entity: "Therapist",
    entityId: therapist._id,
    entityName: therapist.name,
    description,
    changes,
  }).catch(() => {});

// ── Create Therapist ──────────────────────────────────────────
export const createTherapist = async (req, res) => {
  try {
    const { name, specialization, phone, email } = req.body;

    if (!name || !specialization || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, specialization, phone and email are required",
      });
    }

    const therapist = await Therapist.create({ name, specialization, phone, email });

    await log(
      "THERAPIST_CREATED",
      therapist,
      `New therapist "${therapist.name}" (${therapist.specialization}) was registered.`
    );

    res.status(201).json({
      success: true,
      message: "Therapist created successfully",
      data: therapist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Active Therapists ─────────────────────────────────
export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.status(200).json(therapists);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Deleted Therapists ────────────────────────────────────
export const getDeletedTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({ isDeleted: true }).sort({ deletedAt: -1 });
    return res.status(200).json(therapists);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Therapist By ID ───────────────────────────────────────
export const getTherapistById = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }

    res.status(200).json(therapist);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Therapist ──────────────────────────────────────────
export const updateTherapist = async (req, res) => {
  try {
    const { name, specialization, phone, email } = req.body;

    const existing = await Therapist.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }

    const changes = {};
    if (name           && name           !== existing.name)           changes.name           = { from: existing.name,           to: name           };
    if (specialization && specialization !== existing.specialization) changes.specialization = { from: existing.specialization, to: specialization };
    if (phone          && phone          !== existing.phone)          changes.phone          = { from: existing.phone,          to: phone          };
    if (email          && email          !== existing.email)          changes.email          = { from: existing.email,          to: email          };

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { name, specialization, phone, email },
      { new: true, runValidators: true }
    );

    await log(
      "THERAPIST_UPDATED",
      therapist,
      `Therapist "${therapist.name}" was updated.`,
      Object.keys(changes).length ? changes : null
    );

    res.status(200).json({
      success: true,
      message: "Therapist updated successfully",
      data: therapist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Soft Delete Therapist ─────────────────────────────────────
export const deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }

    if (therapist.isDeleted) {
      return res.status(400).json({ success: false, message: "Therapist is already deleted" });
    }

    therapist.isDeleted = true;
    therapist.deletedAt = new Date();
    await therapist.save();

    await log("THERAPIST_DELETED", therapist, `Therapist "${therapist.name}" was soft-deleted.`);

    res.status(200).json({ success: true, message: "Therapist deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Restore Soft-Deleted Therapist ───────────────────────────
export const restoreTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ success: false, message: "Therapist not found" });
    }

    if (!therapist.isDeleted) {
      return res.status(400).json({ success: false, message: "Therapist is not deleted" });
    }

    therapist.isDeleted = false;
    therapist.deletedAt = null;
    await therapist.save();

    await log("THERAPIST_RESTORED", therapist, `Therapist "${therapist.name}" was restored.`);

    res.status(200).json({
      success: true,
      message: "Therapist restored successfully",
      data: therapist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};