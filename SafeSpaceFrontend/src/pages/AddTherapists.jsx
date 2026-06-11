import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

export default function AddTherapists() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", specialization: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/therapists`, form);
      navigate("/therapists");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add therapist.");
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Therapist">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Add New Therapist</h2>
          <p className="page-header__sub">Register a new therapist to the team.</p>
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

          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Dr. Ayesha Khan"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Cognitive Behavioral Therapy"
                  value={form.specialization}
                  onChange={set("specialization")}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 0300-1234567"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="e.g. dr.ayesha@safespace.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>

            <div className="btn-row">
              <button className="btn btn--primary btn--lg" type="submit" disabled={loading}>
                {loading ? "Saving…" : "✓ Save Therapist"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={() => navigate("/therapists")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}