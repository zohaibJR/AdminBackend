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

    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 30);

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
      recentClients,
      mostActiveClientResult,
      todaysSessionsList,
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

      Client.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name"),

      Session.aggregate([
        {
          $group: {
            _id: "$clientId",
            totalSessions: { $sum: 1 },
          },
        },
        {
          $sort: {
            totalSessions: -1,
          },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $unwind: "$client",
        },
      ]),

      Session.find({
        sessionDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
        .populate("clientId", "name")
        .sort({ sessionTime: 1 }),
    ]);

    const activeClientIds = await Session.distinct("clientId", {
      sessionDate: {
        $gte: inactiveDate,
      },
    });

    const inactiveClients = await Client.find({
      _id: {
        $nin: activeClientIds,
      },
    }).select("name");

    res.status(200).json({
      totalClients,
      totalTherapists,
      totalSessions,

      totalRevenue: revenueResult[0]?.totalRevenue || 0,

      totalMyShare: shareResult[0]?.totalMyShare || 0,

      todaySessions,
      upcomingSessions,
      cancelledThisWeek,
      pendingPayments,

      recentClients,

      mostActiveClient:
        mostActiveClientResult.length > 0
          ? {
              name: mostActiveClientResult[0].client.name,
              sessions: mostActiveClientResult[0].totalSessions,
            }
          : null,

      todaysSessionsList: todaysSessionsList.map((session) => ({
        id: session._id,
        time: session.sessionTime,
        clientName: session.clientId?.name || "Unknown Client",
      })),

      inactiveClients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};