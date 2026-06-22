import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};