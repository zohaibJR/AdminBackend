import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function DisplayClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/clients`)
      .then((res) => { setClients(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteClient = async (id) => {
    if (!window.confirm("Delete this client? This cannot be undone.")) return;
    try {
      await axios.delete(`${API}/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete client.");
    }
  };

  return (
    <AdminLayout title="Clients">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Clients</h2>
          <p className="page-header__sub">{clients.length} client{clients.length !== 1 ? "s" : ""} registered</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate("/addclient")}>
          + Add Client
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👤</div>
            <div className="empty-state__title">No clients yet</div>
            <p className="empty-state__text">Add your first client to get started.</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate("/addclient")}>
              + Add Client
            </button>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar">{initials(c.name)}</div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: "var(--text-secondary)", maxWidth: 200 }}>
                      {c.note || <span style={{ opacity: .45 }}>—</span>}
                    </td>
                    <td>
                      <div className="btn-row">
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