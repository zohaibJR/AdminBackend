import Session from "../models/session.js";

export const createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("clientId", "name")
      .populate("therapistId", "name")
      .sort({ sessionDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("clientId", "name")
      .populate("therapistId", "name");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};