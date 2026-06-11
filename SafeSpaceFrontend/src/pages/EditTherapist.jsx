import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

export default function EditTherapist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", specialization: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    axios.get(`${API}/therapists/${id}`)
      .then((res) => {
        const { name, specialization, phone, email } = res.data;
        setForm({ name, specialization, phone, email });
        setLoading(false);
      })
      .catch(() => { setError("Could not load therapist."); setLoading(false); });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await axios.put(`${API}/therapists/${id}`, form);
      navigate("/therapists");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Edit Therapist">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Edit Therapist</h2>
          <p className="page-header__sub">Update therapist details below.</p>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate("/therapists")}>
          ← Back to Therapists
        </button>
      </div>

      <div className="card" style={{ maxWidth: 620 }}>
        <div className="card__header">
          <span className="card__title">Therapist Information</span>
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
                  <input className="form-input" type="text" value={form.name} onChange={set("name")} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <input className="form-input" type="text" value={form.specialization} onChange={set("specialization")} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" type="text" value={form.phone} onChange={set("phone")} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" value={form.email} onChange={set("email")} required />
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn--primary btn--lg" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "✓ Update Therapist"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => navigate("/therapists")}>
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