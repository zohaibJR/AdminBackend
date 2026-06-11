import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DisplayTherapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/therapists`)
      .then((res) => { setTherapists(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteTherapist = async (id) => {
    if (!window.confirm("Delete this therapist? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/therapists/${id}`);
      setTherapists((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete therapist.");
    }
  };

  return (
    <AdminLayout title="Therapists">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Therapists</h2>
          <p className="page-header__sub">{therapists.length} therapist{therapists.length !== 1 ? "s" : ""} on the team</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/addtherapist")}>
          + Add Therapist
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : therapists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🧠</div>
            <div className="empty-state__title">No therapists yet</div>
            <p className="empty-state__text">Add your first therapist to begin assigning sessions.</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/addtherapist")}>
              + Add Therapist
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Therapist</th>
                  <th>Specialization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {therapists.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar" style={{ background: "linear-gradient(135deg,#34c9a0,#1e8399)" }}>
                          {initials(t.name)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--paid">{t.specialization}</span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{t.email}</td>
                    <td>{t.phone}</td>
                    <td>
                      <div className="btn-row">
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => navigate(`/edittherapist/${t._id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => deleteTherapist(t._id)}
                        >
                          🗑 Delete
                        </button>
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