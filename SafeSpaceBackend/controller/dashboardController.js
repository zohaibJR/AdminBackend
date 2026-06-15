import Client from "../models/client.js";
import Therapist from "../models/therapist.js";
import Session from "../models/session.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const next24Hours = new Date(now);
    next24Hours.setHours(now.getHours() + 24);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const [
      totalClients,
      totalTherapists,
      totalSessions,

      revenueResult,
      shareResult,

      todaySessions,
      upcomingSessions,
      cancelledThisWeek,
      pendingPayments,
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
            totalRevenue: {
              $sum: "$sessionPayment",
            },
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
            totalMyShare: {
              $sum: "$myShareAmount",
            },
          },
        },
      ]),

      Session.countDocuments({
        sessionDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      Session.countDocuments({
        sessionDate: {
          $gte: now,
          $lte: next24Hours,
        },
        status: "Pending",
      }),

      Session.countDocuments({
        status: "Cancelled",
        sessionDate: {
          $gte: startOfWeek,
        },
      }),

      Session.countDocuments({
        paymentStatus: "Payment Pending",
      }),
    ]);

    res.status(200).json({
      totalClients,
      totalTherapists,
      totalSessions,

      totalRevenue:
        revenueResult[0]?.totalRevenue || 0,

      totalMyShare:
        shareResult[0]?.totalMyShare || 0,

      todaySessions,
      upcomingSessions,
      cancelledThisWeek,
      pendingPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};