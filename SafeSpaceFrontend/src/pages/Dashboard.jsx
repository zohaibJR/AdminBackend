import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Users, Brain, Calendar, DollarSign, Award, Plus, ArrowUpRight, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

// Importing our high-end dedicated stylesheet
import "../styles/dashboard-premium.css";

const API = "http://localhost:5000/api";
const STATUS_COLORS = ["#0d9488", "#f59e0b", "#ef4444", "#64748b"];

function StatCard({ icon: Icon, value, label, trend, variant }) {
  return (
    <div className={`premium-kpi-card kpi-card--${variant}`}>
      <div className="kpi-card__upper">
        <div className="kpi-card__details">
          <span className="kpi-card__label">{label}</span>
          <h3 className="kpi-card__value">{value}</h3>
        </div>
        <div className="kpi-card__icon-wrapper">
          <Icon className="kpi-card__icon" />
        </div>
      </div>
      {trend && (
        <div className="kpi-card__trend-badge">
          <ArrowUpRight className="trend-badge__arrow" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalClients: 0,
    totalTherapists: 0,
    totalSessions: 0,
    totalRevenue: 0,
    totalMyShare: 0,
    statusData: [],
    trendsData: [],
    upcomingSessions: [],
    alerts: { pendingPayments: 0 }
  });

  const fetchDashboardMetrics = () => {
    setLoading(true);
    axios.get(`${API}/dashboard`)
      .then((res) => {
        setData(prev => ({ ...prev, ...res.data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard-viewport">
        
        {/* Header Block */}
        <div className="dashboard-hdr">
          <div className="dashboard-hdr__text">
            <h2 className="dashboard-hdr__title">Welcome back 👋</h2>
            <p className="dashboard-hdr__subtitle">Here's an analytical snapshot of SafeSpace today.</p>
          </div>
          <button onClick={fetchDashboardMetrics} className="dashboard-refresh-btn">
            <RefreshCw className="refresh-btn__icon" />
            <span>Refresh Portal</span>
          </button>
        </div>

        {loading ? (
          <div className="dashboard-loader">
            <div className="dashboard-loader__spinner"></div>
            <p>Syncing records with cloud database...</p>
          </div>
        ) : (
          <div className="dashboard-layout-space">
            
            {/* ROW 1: KPI Stats Grid */}
            <div className="kpi-grid">
              <StatCard icon={Users} value={data.totalClients} label="Total Clients" trend="+12% this month" variant="teal" />
              <StatCard icon={Brain} value={data.totalTherapists} label="Therapists" trend="Active" variant="mint" />
              <StatCard icon={Calendar} value={data.totalSessions} label="Total Sessions" variant="blue" />
              <StatCard icon={DollarSign} value={`Rs ${fmt(data.totalRevenue)}`} label="Revenue Collected" variant="amber" />
              <StatCard icon={Award} value={`Rs ${fmt(data.totalMyShare)}`} label="My Share Received" variant="green" />
            </div>

            {/* ROW 2: Core Operational Management Actions */}
            <div className="operations-card">
              <h4 className="operations-card__title">Core Client Actions</h4>
              <div className="operations-card__actions-row">
                <button onClick={() => navigate("/addclient")} className="action-pill action-pill--primary">
                  <Plus className="action-pill__icon" /> Add Client
                </button>
                <button onClick={() => navigate("/addtherapist")} className="action-pill action-pill--secondary">
                  <Plus className="action-pill__icon" /> Add Therapist
                </button>
                <button onClick={() => navigate("/addsession")} className="action-pill action-pill--secondary">
                  <Plus className="action-pill__icon" /> Book Session
                </button>
                <button onClick={() => navigate("/sessions")} className="action-pill action-pill--link">
                  View All Sessions Table
                </button>
              </div>
            </div>

            {/* ROW 3: Visual Analytics Analytics Data Sets */}
            <div className="analytics-charts-row">
              {/* Trends Card Chart */}
              <div className="analytics-card charts-col-span-2">
                <h3 className="analytics-card__heading">Sessions & Revenue Trends</h3>
                <div className="chart-wrapper-box">
                  {data.trendsData.length === 0 ? (
                    <div className="chart-fallback">Not enough historical telemetry to generate time series curves.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="premiumRevGlow" x1="0" y1="0" x2="0" y2="100%">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }} />
                        <Area type="monotone" dataKey="Revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#premiumRevGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Section Breakdown */}
              <div className="analytics-card">
                <h3 className="analytics-card__heading">Session Distribution Breakdown</h3>
                <div className="pie-wrapper-box">
                  {data.statusData.length === 0 ? (
                    <div className="chart-fallback">No session metrics available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                          {data.statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="pie-legend-grid">
                  {data.statusData.map((item, idx) => (
                    <div key={item.name} className="pie-legend-item">
                      <span className="pie-legend-bullet" style={{ backgroundColor: STATUS_COLORS[idx % STATUS_COLORS.length] }}></span>
                      <span className="pie-legend-txt">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 4: Critical Dynamic Alerts & Operational Tables */}
            <div className="bottom-meta-row">
              {/* Alert Module */}
              <div className="alerts-card">
                <div className="alerts-card__header">
                  <span className="alerts-card__pulse-dot"></span>
                  <h3 className="alerts-card__heading">Critical Operational Tasks</h3>
                </div>
                
                <div className="alerts-card__stack">
                  {data.alerts.pendingPayments > 0 ? (
                    <div className="alert-banner alert-banner--danger">
                      <AlertTriangle className="alert-banner__icon" />
                      <div className="alert-banner__content">
                        <span className="alert-banner__title">{data.alerts.pendingPayments} Invoices Awaiting Payment</span>
                        <p className="alert-banner__desc">Sessions are marked 'Done' but payment collection field status is false.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="alert-banner alert-banner--success">
                      <span className="alert-banner__sparkle">✨</span>
                      <p className="alert-banner__desc">All active customer database payment parameters have been audited.</p>
                    </div>
                  )}

                  <div className="alert-banner alert-banner--info">
                    <Clock className="alert-banner__icon" />
                    <div className="alert-banner__content">
                      <span className="alert-banner__title">Upcoming Sessions Verified</span>
                      <p className="alert-banner__desc">Review assigned room credentials and secure tele-health tokens.</p>
                    </div>
                  </div>
                </div>
                <div className="alerts-card__footer">Flags reset automatically based on updates.</div>
              </div>

              {/* Interactive Queue Data Table */}
              <div className="queue-card">
                <h3 className="queue-card__title">Next Operational Sessions Queue</h3>
                <div className="queue-table-scroll-box">
                  <table className="premium-data-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Assigned Therapist</th>
                        <th>Timeline</th>
                        <th>Type</th>
                        <th style={{ textAlignment: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.upcomingSessions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="table-empty-row">No active counseling profiles are currently queued for today.</td>
                        </tr>
                      ) : (
                        data.upcomingSessions.map((session) => (
                          <tr key={session._id}>
                            <td className="cell-patient-name">{session.clientId?.name || "Deleted Client"}</td>
                            <td>{session.therapistId?.name || "Unassigned"}</td>
                            <td className="cell-timestamp">
                              {new Date(session.sessionDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} • {session.sessionTime}
                            </td>
                            <td>
                              <span className={`type-tag type-tag--${session.sessionType?.toLowerCase() === 'online' ? 'indigo' : 'amber'}`}>
                                {session.sessionType}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className={`status-pill status-pill--${session.status?.toLowerCase()}`}>
                                {session.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}