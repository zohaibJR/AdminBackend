import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DisplayTherapists() {
  const [therapists, setTherapists]               = useState([]);
  const [deletedTherapists, setDeletedTherapists] = useState([]);
  const [tab, setTab]                             = useState("active");
  const [loading, setLoading]                     = useState(true);
  const navigate = useNavigate();

  const fetchTherapists = () => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/therapists`),
      axios.get(`${API}/therapists/deleted`),
    ])
      .then(([active, deleted]) => {
        setTherapists(active.data);
        setDeletedTherapists(deleted.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTherapists(); }, []);

  const deleteTherapist = async (id) => {
    if (!window.confirm("Move this therapist to trash? You can restore them later.")) return;
    try {
      await axios.delete(`${API}/therapists/${id}`);
      fetchTherapists();
    } catch {
      alert("Failed to delete therapist.");
    }
  };

  const restoreTherapist = async (id) => {
    try {
      await axios.patch(`${API}/therapists/${id}/restore`);
      fetchTherapists();
    } catch {
      alert("Failed to restore therapist.");
    }
  };

  const shown = tab === "active" ? therapists : deletedTherapists;

  return (
    <AdminLayout title="Therapists">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Therapists</h2>
          <p className="page-header__sub">
            {therapists.length} active · {deletedTherapists.length} in trash
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/addtherapist")}>
          + Add Therapist
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          className={`btn btn--sm ${tab === "active" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("active")}
        >
          🧠 Active ({therapists.length})
        </button>
        <button
          className={`btn btn--sm ${tab === "deleted" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("deleted")}
          style={deletedTherapists.length > 0 ? { borderColor: "#fca5a5", color: tab === "deleted" ? undefined : "#991b1b" } : {}}
        >
          🗑 Trash ({deletedTherapists.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">{tab === "active" ? "🧠" : "🗑"}</div>
            <div className="empty-state__title">
              {tab === "active" ? "No therapists yet" : "Trash is empty"}
            </div>
            <p className="empty-state__text">
              {tab === "active"
                ? "Add your first therapist to begin assigning sessions."
                : "Deleted therapists will appear here and can be restored."}
            </p>
            {tab === "active" && (
              <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/addtherapist")}>
                + Add Therapist
              </button>
            )}
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
                  {tab === "deleted" && <th>Deleted At</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((t) => (
                  <tr key={t._id} style={tab === "deleted" ? { opacity: 0.7 } : {}}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          className="avatar"
                          style={
                            tab === "deleted"
                              ? { background: "linear-gradient(135deg,#94a3b8,#cbd5e1)", filter: "grayscale(1)" }
                              : { background: "linear-gradient(135deg,#34c9a0,#1e8399)" }
                          }
                        >
                          {initials(t.name)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--paid" style={tab === "deleted" ? { opacity: 0.6 } : {}}>
                        {t.specialization}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{t.email}</td>
                    <td>{t.phone}</td>
                    {tab === "deleted" && (
                      <td style={{ color: "var(--text-muted)", fontSize: ".8rem", whiteSpace: "nowrap" }}>
                        {t.deletedAt
                          ? new Date(t.deletedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                    )}
                    <td>
                      <div className="btn-row">
                        {tab === "active" ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ borderColor: "var(--mint-400)", color: "#166534" }}
                            onClick={() => restoreTherapist(t._id)}
                          >
                            ♻️ Restore
                          </button>
                        )}
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