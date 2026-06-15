import Client from "../models/client.js";
import Therapist from "../models/therapist.js";
import Session from "../models/session.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Define the start of today for upcoming session tracking
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalClients,
      totalTherapists,
      totalSessions,
      revenueResult,
      shareResult,
      statusBreakdown,
      monthlyFinancials,
      upcomingSessions,
      pendingPaymentsCount
    ] = await Promise.all([
      Client.countDocuments(),
      Therapist.countDocuments(),
      Session.countDocuments(),
      
      // 1. Total Revenue Collected
      Session.aggregate([
        { $match: { status: "Done", paymentReceived: true } },
        { $group: { _id: null, totalRevenue: { $sum: "$sessionPayment" } } },
      ]),

      // 2. Platform Share Amount Received
      Session.aggregate([
        { $match: { status: "Done", didIReceiveMyShare: true } },
        { $group: { _id: null, totalMyShare: { $sum: "$myShareAmount" } } },
      ]),

      // 3. Status Breakdown for Doughnut Chart
      Session.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      // 4. 6-Month Combined Trends for Area/Line Chart
      Session.aggregate([
        {
          $match: {
            status: "Done",
            paymentReceived: true,
            sessionDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$sessionDate" } },
            revenue: { $sum: "$sessionPayment" },
            sessions: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // 5. Next 5 Upcoming Sessions (Today and Future)
      Session.find({ sessionDate: { $gte: todayStart } })
        .populate("clientId", "name")
        .populate("therapistId", "name")
        .sort({ sessionDate: 1, sessionTime: 1 })
        .limit(5)
        .lean(),

      // 6. Alert metric: Completed sessions that have not processed payment
      Session.countDocuments({ status: "Done", paymentReceived: false })
    ]);

    // Format monthly data labels for Recharts (e.g., "2026-06" to "Jun")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrends = monthlyFinancials.map(item => {
      const [year, month] = item._id.split("-");
      return {
        month: monthNames[parseInt(month, 10) - 1],
        Revenue: item.revenue,
        Sessions: item.sessions
      };
    });

    // Structure complete operational data payloads
    res.status(200).json({
      totalClients,
      totalTherapists,
      totalSessions,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      totalMyShare: shareResult[0]?.totalMyShare || 0,
      statusData: statusBreakdown.map(s => ({ name: s._id, value: s.count })),
      trendsData: formattedTrends,
      upcomingSessions,
      alerts: {
        pendingPayments: pendingPaymentsCount,
        unassignedSessions: 0 // Hook up logic here if matching an unassigned parameter later
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};