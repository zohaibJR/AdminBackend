import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTherapists: 0,
    totalSessions: 0,
    totalRevenue: 0,
    totalMyShare: 0,
  });

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Total Clients</h2>
        <p>{stats.totalClients}</p>
      </div>

      <div>
        <h2>Total Therapists</h2>
        <p>{stats.totalTherapists}</p>
      </div>

      <div>
        <h2>Total Sessions</h2>
        <p>{stats.totalSessions}</p>
      </div>

      <div>
        <h2>Total Revenue</h2>
        <p>{formatMoney(stats.totalRevenue)}</p>
      </div>

      <div>
        <h2>Total My Share</h2>
        <p>{formatMoney(stats.totalMyShare)}</p>
      </div>
    </div>
  );
}

export default Dashboard;
