import Client from "../models/client.js";
import Therapist from "../models/therapist.js";
import Session from "../models/session.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalClients,
      totalTherapists,
      totalSessions,
      revenueResult,
      shareResult,
    ] = await Promise.all([
      Client.countDocuments(),
      Therapist.countDocuments(),
      Session.countDocuments(),
      Session.aggregate([
        {
          $match: {
            status: "Done",
            paymentReceived: true,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$sessionPayment" },
          },
        },
      ]),
      Session.aggregate([
        {
          $match: {
            status: "Done",
            didIReceiveMyShare: true,
          },
        },
        {
          $group: {
            _id: null,
            totalMyShare: { $sum: "$myShareAmount" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      totalClients,
      totalTherapists,
      totalSessions,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      totalMyShare: shareResult[0]?.totalMyShare || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
