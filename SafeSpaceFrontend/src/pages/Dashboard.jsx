import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function StatCard({ icon, value, label, variant }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function fmt(n) {
  return Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTherapists: 0,
    totalSessions: 0,
    totalRevenue: 0,
    totalMyShare: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/dashboard`)
      .then((res) => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Welcome back 👋</h2>
          <p className="page-header__sub">Here's what's happening at SafeSpace today.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 48 }}>
          Loading stats…
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard icon="👤" value={stats.totalClients}    label="Total Clients"    variant="teal"  />
            <StatCard icon="🧠" value={stats.totalTherapists} label="Therapists"       variant="mint"  />
            <StatCard icon="📅" value={stats.totalSessions}   label="Total Sessions"   variant="blue"  />
            <StatCard icon="💰" value={`Rs ${fmt(stats.totalRevenue)}`}  label="Revenue Collected"  variant="amber" />
            <StatCard icon="🏦" value={`Rs ${fmt(stats.totalMyShare)}`}  label="My Share Received"  variant="green" />
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card__header">
              <span className="card__title">Quick Actions</span>
            </div>
            <div className="card__body" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn--primary" onClick={() => navigate("/addclient")}>
                + Add Client
              </button>
              <button className="btn btn--ghost" onClick={() => navigate("/addtherapist")}>
                + Add Therapist
              </button>
              <button className="btn btn--ghost" onClick={() => navigate("/addsession")}>
                + Add Session
              </button>
              <button className="btn btn--ghost" onClick={() => navigate("/sessions")}>
                View All Sessions
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}