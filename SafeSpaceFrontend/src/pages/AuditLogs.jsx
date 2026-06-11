import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const ACTION_LABELS = {
  CLIENT_CREATED:          { label: "Client Created",          color: "badge--done"      },
  CLIENT_UPDATED:          { label: "Client Updated",          color: "badge--paid"      },
  CLIENT_DELETED:          { label: "Client Deleted",          color: "badge--cancelled" },
  CLIENT_RESTORED:         { label: "Client Restored",         color: "badge--done"      },
  THERAPIST_CREATED:       { label: "Therapist Created",       color: "badge--done"      },
  THERAPIST_UPDATED:       { label: "Therapist Updated",       color: "badge--paid"      },
  THERAPIST_DELETED:       { label: "Therapist Deleted",       color: "badge--cancelled" },
  THERAPIST_RESTORED:      { label: "Therapist Restored",      color: "badge--done"      },
  SESSION_CREATED:         { label: "Session Created",         color: "badge--done"      },
  SESSION_UPDATED:         { label: "Session Updated",         color: "badge--paid"      },
  SESSION_DELETED:         { label: "Session Deleted",         color: "badge--cancelled" },
  SESSION_STATUS_CHANGED:  { label: "Status Changed",          color: "badge--pending"   },
  SESSION_PAYMENT_UPDATED: { label: "Payment Updated",         color: "badge--refunded"  },
};

const ENTITY_ICONS = { Client: "👤", Therapist: "🧠", Session: "📅" };

function ChangePill({ changes }) {
  if (!changes || !Object.keys(changes).length) return null;
  return (
    <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
      {Object.entries(changes).map(([field, { from, to }]) => (
        <span
          key={field}
          style={{
            fontSize: ".72rem",
            background: "var(--slate-100)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
            padding: "2px 8px",
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>{field}</strong>:{" "}
          <span style={{ textDecoration: "line-through", opacity: .6 }}>{String(from)}</span>
          {" → "}
          <span style={{ color: "var(--teal-600)" }}>{String(to)}</span>
        </span>
      ))}
    </div>
  );
}

export default function AuditLogs() {
  const [logs, setLogs]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [clearing, setClearing]   = useState(false);

  const [filters, setFilters] = useState({
    entity: "",
    action: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50, ...filters };
      // Remove empty params
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await axios.get(`${API}/audit-logs`, { params });
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput }));
    setPage(1);
  };

  const setFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };

  const clearAllLogs = async () => {
    if (!window.confirm("Permanently delete ALL audit logs? This cannot be undone.")) return;
    setClearing(true);
    try {
      await axios.delete(`${API}/audit-logs/clear`);
      fetchLogs();
    } catch {
      alert("Failed to clear audit logs.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <AdminLayout title="Audit Logs">
      <div className="page-header">
        <div className="page-header__text">
          <h2 className="page-header__title">Audit Logs</h2>
          <p className="page-header__sub">{total} event{total !== 1 ? "s" : ""} recorded</p>
        </div>
        <button
          className="btn btn--danger btn--sm"
          onClick={clearAllLogs}
          disabled={clearing || logs.length === 0}
        >
          🗑 Clear All Logs
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card__body" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, flex: "1 1 240px" }}>
              <input
                className="form-input"
                style={{ flex: 1 }}
                type="text"
                placeholder="Search description, entity name…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn--primary btn--sm" type="submit">Search</button>
            </form>

            {/* Entity filter */}
            <div style={{ flex: "0 0 150px" }}>
              <select
                className="form-select"
                value={filters.entity}
                onChange={(e) => setFilter("entity", e.target.value)}
              >
                <option value="">All Entities</option>
                <option value="Client">👤 Client</option>
                <option value="Therapist">🧠 Therapist</option>
                <option value="Session">📅 Session</option>
              </select>
            </div>

            {/* Action filter */}
            <div style={{ flex: "0 0 200px" }}>
              <select
                className="form-select"
                value={filters.action}
                onChange={(e) => setFilter("action", e.target.value)}
              >
                <option value="">All Actions</option>
                {Object.entries(ACTION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {(filters.entity || filters.action || filters.search) && (
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => { setFilters({ entity: "", action: "", search: "" }); setSearchInput(""); setPage(1); }}
              >
                ✕ Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <div className="empty-state__title">No audit logs found</div>
            <p className="empty-state__text">
              {filters.entity || filters.action || filters.search
                ? "Try clearing your filters."
                : "Actions performed in the system will be recorded here."}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Entity</th>
                    <th>Action</th>
                    <th>Description &amp; Changes</th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const meta = ACTION_LABELS[log.action] || { label: log.action, color: "badge--nopay" };
                    return (
                      <tr key={log._id}>
                        <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".8rem" }}>
                          {new Date(log.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          <div style={{ fontSize: ".72rem" }}>
                            {new Date(log.createdAt).toLocaleTimeString("en-PK", {
                              hour: "2-digit", minute: "2-digit", second: "2-digit",
                            })}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "1rem" }}>{ENTITY_ICONS[log.entity] || "📌"}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{log.entity}</div>
                              <div style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>
                                {log.entityName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${meta.color}`}>{meta.label}</span>
                        </td>
                        <td style={{ maxWidth: 380 }}>
                          <div style={{ fontSize: ".875rem" }}>{log.description}</div>
                          <ChangePill changes={log.changes} />
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontSize: ".85rem" }}>
                          {log.performedBy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "16px 24px", borderTop: "1px solid var(--border)",
              }}>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: ".85rem", color: "var(--text-secondary)" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}