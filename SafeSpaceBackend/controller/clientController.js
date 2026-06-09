import Client from "../models/client.js";

export const createClient = async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required",
      });
    }

    const client = await Client.create({
      name,
      phone,
      email,
      note,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};