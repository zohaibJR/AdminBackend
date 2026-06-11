import Client from "../models/client.js";
import AuditLog from "../models/auditLog.js";

// ── Helpers ──────────────────────────────────────────────────
const log = (action, client, description, changes = null) =>
  AuditLog.create({
    action,
    entity: "Client",
    entityId: client._id,
    entityName: client.name,
    description,
    changes,
  }).catch(() => {}); // non-blocking — never let audit failure break the main flow

// ── Create Client ─────────────────────────────────────────────
export const createClient = async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required",
      });
    }

    const client = await Client.create({ name, phone, email, note });

    await log("CLIENT_CREATED", client, `New client "${client.name}" was registered.`);

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Active Clients ────────────────────────────────────
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Deleted Clients ───────────────────────────────────────
export const getDeletedClients = async (req, res) => {
  try {
    const clients = await Client.find({ isDeleted: true }).sort({ deletedAt: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Client By ID ──────────────────────────────────────────
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Client ─────────────────────────────────────────────
export const updateClient = async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;

    const existing = await Client.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const changes = {};
    if (name  && name  !== existing.name)  changes.name  = { from: existing.name,  to: name  };
    if (phone && phone !== existing.phone) changes.phone = { from: existing.phone, to: phone };
    if (email && email !== existing.email) changes.email = { from: existing.email, to: email };
    if (note  !== undefined && note !== existing.note) changes.note = { from: existing.note, to: note };

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, note },
      { new: true, runValidators: true }
    );

    await log(
      "CLIENT_UPDATED",
      client,
      `Client "${client.name}" was updated.`,
      Object.keys(changes).length ? changes : null
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Soft Delete Client ────────────────────────────────────────
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (client.isDeleted) {
      return res.status(400).json({ success: false, message: "Client is already deleted" });
    }

    client.isDeleted = true;
    client.deletedAt = new Date();
    await client.save();

    await log("CLIENT_DELETED", client, `Client "${client.name}" was soft-deleted.`);

    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Restore Soft-Deleted Client ───────────────────────────────
export const restoreClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (!client.isDeleted) {
      return res.status(400).json({ success: false, message: "Client is not deleted" });
    }

    client.isDeleted = false;
    client.deletedAt = null;
    await client.save();

    await log("CLIENT_RESTORED", client, `Client "${client.name}" was restored.`);

    res.status(200).json({
      success: true,
      message: "Client restored successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};