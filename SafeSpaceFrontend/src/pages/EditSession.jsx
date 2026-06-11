import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

export default function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    therapistId: "",
    sessionNo: "",
    sessionDate: "",
    sessionTime: "",
    sessionType: "Online",
    charges: "",
    status: "Pending",
    paymentReceived: false,
    didIReceiveMyShare: false,
    notes: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setCheck = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/clients`),
      axios.get(`${API}/therapists`),
      axios.get(`${API}/sessions/${id}`),
    ])
      .then(([cl, th, se]) => {
        setClients(cl.data);
        setTherapists(th.data);
        const s = se.data;
        setForm({
          clientId:          s.clientId?._id || s.clientId,
          therapistId:       s.therapistId?._id || s.therapistId,
          sessionNo:         s.sessionNo,
          sessionDate:       s.sessionDate?.split("T")[0] || "",
          sessionTime:       s.sessionTime,
          sessionType:       s.sessionType,
          charges:           s.charges,
          status:            s.status,
          paymentReceived:   Boolean(s.paymentReceived),
          didIReceiveMyShare: Boolean(s.didIReceiveMyShare),
          notes:             s.notes || "",
        });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load session data."); setLoading(false); });
  }, [id]);

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      status: val,
      paymentReceived: val !== "Done" ? false : f.paymentReceived,
      didIReceiveMyShare: val !== "Done" ? false : f.didIReceiveMyShare,
    }));
  };

  const handlePaymentChange = (e) => {
    const checked = e.target.checked;
    setForm((f) => ({
      ...f,
      paymentReceived: checked,
      didIReceiveMyShare: !checked ? false : f.didIReceiveMyShare,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await axios.put(`${API}/sessions/${id}`, form);
      navigate("/sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Edit Session">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Edit Session</h2>
          <p className="page-header__sub">Update session information below.</p>
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

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-secondary)", marginBottom: 12 }}>Participants</p>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Client *</label>
                    <select className="form-select" value={form.clientId} onChange={set("clientId")} required>
                      <option value="">Select client…</option>
                      {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Therapist *</label>
                    <select className="form-select" value={form.therapistId} onChange={set("therapistId")} required>
                      <option value="">Select therapist…</option>
                      {therapists.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ margin: "24px 0 8px" }}>
                <p style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-secondary)", marginBottom: 12 }}>Scheduling</p>
                <div className="form-grid form-grid--3">
                  <div className="form-group">
                    <label className="form-label">Session No. *</label>
                    <input className="form-input" type="number" min="1" value={form.sessionNo} onChange={set("sessionNo")} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input className="form-input" type="date" value={form.sessionDate} onChange={set("sessionDate")} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <input className="form-input" type="time" value={form.sessionTime} onChange={set("sessionTime")} required />
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
                    <input className="form-input" type="number" min="0" value={form.charges} onChange={set("charges")} required />
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

              <div style={{ margin: "24px 0 8px" }}>
                <p style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--text-secondary)", marginBottom: 12 }}>Payment</p>
                <div className="form-grid">
                  <label className={`form-check${form.status !== "Done" ? " form-check--disabled" : ""}`}>
                    <input type="checkbox" checked={form.paymentReceived} disabled={form.status !== "Done"} onChange={handlePaymentChange} />
                    <span className="form-check__label">💰 Payment received from client</span>
                  </label>

                  <label className={`form-check${(form.status !== "Done" || !form.paymentReceived) ? " form-check--disabled" : ""}`}>
                    <input type="checkbox" checked={form.didIReceiveMyShare} disabled={form.status !== "Done" || !form.paymentReceived} onChange={setCheck("didIReceiveMyShare")} />
                    <span className="form-check__label">🏦 My 20% share received</span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: 20, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Session Notes</label>
                  <textarea className="form-textarea" value={form.notes} onChange={set("notes")} />
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn--primary btn--lg" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "✓ Update Session"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => navigate("/sessions")}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}