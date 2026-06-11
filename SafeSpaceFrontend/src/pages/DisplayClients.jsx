import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DisplayClients() {
  const [clients, setClients]           = useState([]);
  const [deletedClients, setDeletedClients] = useState([]);
  const [tab, setTab]                   = useState("active"); // "active" | "deleted"
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  const fetchClients = () => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/clients`),
      axios.get(`${API}/clients/deleted`),
    ])
      .then(([active, deleted]) => {
        setClients(active.data);
        setDeletedClients(deleted.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const deleteClient = async (id) => {
    if (!window.confirm("Move this client to trash? You can restore them later.")) return;
    try {
      await axios.delete(`${API}/clients/${id}`);
      fetchClients();
    } catch {
      alert("Failed to delete client.");
    }
  };

  const restoreClient = async (id) => {
    try {
      await axios.patch(`${API}/clients/${id}/restore`);
      fetchClients();
    } catch {
      alert("Failed to restore client.");
    }
  };

  const shown = tab === "active" ? clients : deletedClients;

  return (
    <AdminLayout title="Clients">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Clients</h2>
          <p className="page-header__sub">
            {clients.length} active · {deletedClients.length} in trash
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/addclient")}>
          + Add Client
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          className={`btn btn--sm ${tab === "active" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("active")}
        >
          👤 Active ({clients.length})
        </button>
        <button
          className={`btn btn--sm ${tab === "deleted" ? "btn--primary" : "btn--ghost"}`}
          onClick={() => setTab("deleted")}
          style={deletedClients.length > 0 ? { borderColor: "#fca5a5", color: tab === "deleted" ? undefined : "#991b1b" } : {}}
        >
          🗑 Trash ({deletedClients.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">{tab === "active" ? "👤" : "🗑"}</div>
            <div className="empty-state__title">
              {tab === "active" ? "No clients yet" : "Trash is empty"}
            </div>
            <p className="empty-state__text">
              {tab === "active"
                ? "Add your first client to get started."
                : "Deleted clients will appear here and can be restored."}
            </p>
            {tab === "active" && (
              <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/addclient")}>
                + Add Client
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Note</th>
                  {tab === "deleted" && <th>Deleted At</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c._id} style={tab === "deleted" ? { opacity: 0.7 } : {}}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          className="avatar"
                          style={tab === "deleted" ? { background: "linear-gradient(135deg,#94a3b8,#cbd5e1)", filter: "grayscale(1)" } : {}}
                        >
                          {initials(c.name)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: "var(--text-secondary)", maxWidth: 200 }}>
                      {c.note || <span style={{ opacity: .45 }}>—</span>}
                    </td>
                    {tab === "deleted" && (
                      <td style={{ color: "var(--text-muted)", fontSize: ".8rem", whiteSpace: "nowrap" }}>
                        {c.deletedAt
                          ? new Date(c.deletedAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                    )}
                    <td>
                      <div className="btn-row">
                        {tab === "active" ? (
                          <>
                            <button
                              className="btn btn--ghost btn--sm"
                              onClick={() => navigate(`/editclient/${c._id}`)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn--danger btn--sm"
                              onClick={() => deleteClient(c._id)}
                            >
                              🗑 Delete
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ borderColor: "var(--mint-400)", color: "#166534" }}
                            onClick={() => restoreClient(c._id)}
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