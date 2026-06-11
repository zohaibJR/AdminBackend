import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    axios.get(`${API}/clients/${id}`)
      .then((res) => {
        const { name, email, phone, note } = res.data;
        setForm({ name, email, phone, note: note || "" });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load client.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await axios.put(`${API}/clients/${id}`, form);
      // FIX: was navigating to "/" — should go to "/clients"
      navigate("/clients");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Edit Client">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Edit Client</h2>
          <p className="page-header__sub">Update client information below.</p>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate("/clients")}>
          ← Back to Clients
        </button>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <div className="card__header">
          <span className="card__title">Client Information</span>
        </div>
        <div className="card__body">
          {error && <div className="alert alert--error">⚠️ {error}</div>}

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.phone}
                    onChange={set("phone")}
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">Email Address *</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    value={form.note}
                    onChange={set("note")}
                  />
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn--primary btn--lg" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "✓ Update Client"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => navigate("/clients")}>
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