import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

export default function AddSession() {
  const navigate = useNavigate();
  const [clients, setClients]       = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [loadingSessionNo, setLoadingSessionNo] = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    clientId:          "",
    therapistId:       "",
    sessionNo:         "",
    sessionDate:       "",
    sessionTime:       "",
    sessionType:       "Online",
    charges:           "",
    status:            "Pending",
    paymentReceived:   false,
    didIReceiveMyShare: false,
    notes:             "",
  });

  const set      = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setCheck = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  useEffect(() => {
    axios.get(`${API}/clients`).then((r) => setClients(r.data)).catch(console.error);
    axios.get(`${API}/therapists`).then((r) => setTherapists(r.data)).catch(console.error);
  }, []);

  // Auto-fill session number when client is selected
  const handleClientChange = async (e) => {
    const clientId = e.target.value;
    setForm((f) => ({ ...f, clientId, sessionNo: "" }));

    if (!clientId) return;

    setLoadingSessionNo(true);
    try {
      const res = await axios.get(`${API}/sessions/next-session-no/${clientId}`);
      setForm((f) => ({ ...f, sessionNo: res.data.nextSessionNo }));
    } catch {
      // silently ignore — user can type manually
    } finally {
      setLoadingSessionNo(false);
    }
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      status:            val,
      paymentReceived:   val !== "Done" ? false : f.paymentReceived,
      didIReceiveMyShare: val !== "Done" ? false : f.didIReceiveMyShare,
    }));
  };

  const handlePaymentChange = (e) => {
    const checked = e.target.checked;
    setForm((f) => ({
      ...f,
      paymentReceived:   checked,
      didIReceiveMyShare: !checked ? false : f.didIReceiveMyShare,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/sessions`, form);
      navigate("/sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create session.");
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Session">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Add New Session</h2>
          <p className="page-header__sub">Schedule a new therapy session.</p>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate("/sessions")}>
          ← Back to Sessions
        </button>
      </div>

      <div className="card" style={{ maxWidth: 740 }}>
        <div className="card__header">
          <span className="card__title">Session Details</span>
        </div>
        <div className="card__body">
          {error && <div className="alert alert--error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Participants */}
            <div style={{ marginBottom: 8 }}>
              <p className="form-section-label">Participants</p>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Client *</label>
                  <select
                    className="form-select"
                    value={form.clientId}
                    onChange={handleClientChange}
                    required
                  >
                    <option value="">Select client…</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Therapist *</label>
                  <select
                    className="form-select"
                    value={form.therapistId}
                    onChange={set("therapistId")}
                    required
                  >
                    <option value="">Select therapist…</option>
                    {therapists.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div style={{ margin: "24px 0 8px" }}>
              <p className="form-section-label">Scheduling</p>
              <div className="form-grid form-grid--3">
                <div className="form-group">
                  <label className="form-label">
                    Session No. *
                    {loadingSessionNo && (
                      <span style={{ marginLeft: 6, fontSize: ".7rem", color: "var(--teal-400)", fontWeight: 400 }}>
                        loading…
                      </span>
                    )}
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    placeholder="Auto-filled on client select"
                    value={form.sessionNo}
                    onChange={set("sessionNo")}
                    required
                    style={form.sessionNo ? { borderColor: "var(--teal-400)", background: "var(--teal-50)" } : {}}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.sessionDate}
                    onChange={set("sessionDate")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    className="form-input"
                    type="time"
                    value={form.sessionTime}
                    onChange={set("sessionTime")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Session Type</label>
                  <select className="form-select" value={form.sessionType} onChange={set("sessionType")}>
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Charges (Rs) *</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={form.charges}
                    onChange={set("charges")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={handleStatusChange}>
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{ margin: "24px 0 8px" }}>
              <p className="form-section-label">Payment</p>
              <div className="form-grid">
                <label className={`form-check${form.status !== "Done" ? " form-check--disabled" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.paymentReceived}
                    disabled={form.status !== "Done"}
                    onChange={handlePaymentChange}
                  />
                  <span className="form-check__label">💰 Payment received from client</span>
                </label>

                <label className={`form-check${(form.status !== "Done" || !form.paymentReceived) ? " form-check--disabled" : ""}`}>
                  <input
                    type="checkbox"
                    checked={form.didIReceiveMyShare}
                    disabled={form.status !== "Done" || !form.paymentReceived}
                    onChange={setCheck("didIReceiveMyShare")}
                  />
                  <span className="form-check__label">🏦 My 20% share received</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: 20, marginBottom: 24 }}>
              <div className="form-group">
                <label className="form-label">Session Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Any notes about this session…"
                  value={form.notes}
                  onChange={set("notes")}
                />
              </div>
            </div>

            <div className="btn-row">
              <button className="btn btn--primary btn--lg" type="submit" disabled={loading}>
                {loading ? "Saving…" : "✓ Create Session"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={() => navigate("/sessions")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}