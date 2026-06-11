import AuditLog from "../models/auditLog.js";

// Get All Audit Logs with optional filters
export const getAuditLogs = async (req, res) => {
  try {
    const { entity, action, search, limit = 100, page = 1 } = req.query;

    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (search) {
      filter.$or = [
        { entityName:   { $regex: search, $options: "i" } },
        { description:  { $regex: search, $options: "i" } },
        { performedBy:  { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await AuditLog.countDocuments(filter);

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear All Audit Logs
export const clearAuditLogs = async (req, res) => {
  try {
    await AuditLog.deleteMany({});
    res.status(200).json({ success: true, message: "All audit logs cleared." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};