import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

function fmt(n) {
  return "Rs " + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function StatusBadge({ status }) {
  const map = {
    Pending:   "badge--pending",
    Done:      "badge--done",
    Cancelled: "badge--cancelled",
    Refunded:  "badge--refunded",
  };
  return <span className={`badge ${map[status] || ""}`}>{status}</span>;
}

function PayBadge({ status }) {
  if (status === "Payment Received") return <span className="badge badge--paid">Paid</span>;
  if (status === "Payment Pending")  return <span className="badge badge--pending">Pending</span>;
  return <span className="badge badge--nopay">No Payment</span>;
}

export default function DisplaySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/sessions`)
      .then((r) => { setSessions(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const patch = async (id, body) => {
    const res = await axios.put(`${API}/sessions/${id}`, body);
    setSessions((prev) => prev.map((s) => s._id === id ? { ...s, ...res.data.data } : s));
  };

  const updateStatus = (id, status) => patch(id, { status }).catch(() => alert("Update failed."));

  const togglePayment = (session) => {
    patch(session._id, { paymentReceived: !session.paymentReceived }).catch(() => alert("Update failed."));
  };

  const toggleShare = (session) => {
    patch(session._id, { didIReceiveMyShare: !session.didIReceiveMyShare }).catch(() => alert("Update failed."));
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Delete this session? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete session.");
    }
  };

  return (
    <AdminLayout title="Sessions">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Sessions</h2>
          <p className="page-header__sub">{sessions.length} session{sessions.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/addsession")}>
          + Add Session
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📅</div>
            <div className="empty-state__title">No sessions yet</div>
            <p className="empty-state__text">Schedule the first therapy session to get started.</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/addsession")}>
              + Add Session
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Therapist</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Charges</th>
                  <th>Session Pay</th>
                  <th>My Share</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Share</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                      #{s.sessionNo}
                    </td>
                    <td style={{ fontWeight: 500 }}>{s.clientId?.name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{s.therapistId?.name || "—"}</td>
                    <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {new Date(s.sessionDate).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                      <div style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>{s.sessionTime}</div>
                    </td>
                    <td>
                      <span className={`badge ${s.sessionType === "Online" ? "badge--paid" : "badge--nopay"}`}>
                        {s.sessionType === "Online" ? "🖥 Online" : "🏥 Physical"}
                      </span>
                    </td>
                    <td>{fmt(s.charges)}</td>
                    <td style={{ fontWeight: 600 }}>{s.status === "Done" ? fmt(s.sessionPayment) : <span style={{ opacity: .4 }}>—</span>}</td>
                    <td style={{ color: "var(--mint-400)", fontWeight: 600 }}>
                      {s.status === "Done" ? fmt(s.myShareAmount) : <span style={{ opacity: .4 }}>—</span>}
                    </td>
                    <td><StatusBadge status={s.status} /></td>
                    <td><PayBadge status={s.paymentStatus} /></td>
                    <td>
                      {s.didIReceiveMyShare
                        ? <span className="badge badge--done">✓ Received</span>
                        : <span className="badge badge--nopay">Pending</span>
                      }
                    </td>
                    <td>
                      <div className="btn-row" style={{ flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                        {/* Status controls */}
                        {s.status === "Pending" && (
                          <button className="btn btn--ghost btn--sm" onClick={() => updateStatus(s._id, "Done")}>
                            ✓ Done
                          </button>
                        )}
                        {s.status !== "Cancelled" && s.status !== "Done" && (
                          <button className="btn btn--sm" style={{ border: "1.5px solid #fca5a5", color: "#991b1b", background: "transparent" }} onClick={() => updateStatus(s._id, "Cancelled")}>
                            ✕ Cancel
                          </button>
                        )}

                        {/* Payment toggle */}
                        {s.status === "Done" && (
                          <button
                            className={`btn btn--sm ${s.paymentReceived ? "btn--danger" : "btn--ghost"}`}
                            onClick={() => togglePayment(s)}
                          >
                            {s.paymentReceived ? "💰 Unmark Pay" : "💰 Mark Paid"}
                          </button>
                        )}

                        {/* Share toggle */}
                        {s.status === "Done" && s.paymentReceived && (
                          <button
                            className={`btn btn--sm ${s.didIReceiveMyShare ? "btn--danger" : "btn--ghost"}`}
                            onClick={() => toggleShare(s)}
                          >
                            {s.didIReceiveMyShare ? "🏦 Unmark Share" : "🏦 Mark Share"}
                          </button>
                        )}

                        <div className="btn-row" style={{ gap: 6 }}>
                          <button className="btn btn--ghost btn--sm" onClick={() => navigate(`/editsession/${s._id}`)}>
                            ✏️
                          </button>
                          <button className="btn btn--danger btn--sm" onClick={() => deleteSession(s._id)}>
                            🗑
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}