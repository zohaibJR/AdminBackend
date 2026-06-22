import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/admin.css";

const NAV = [
  {
    section: "Overview",
    links: [{ to: "/dashboard", icon: "📊", label: "Dashboard" }],
  },
  {
    section: "Manage",
    links: [
      { to: "/clients", icon: "👤", label: "Clients" },
      { to: "/therapists", icon: "🧠", label: "Therapists" },
      { to: "/sessions", icon: "📅", label: "Sessions" },
    ],
  },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="admin-shell">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 99,
            display: "none",
          }}
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar__brand">
          <NavLink to="/dashboard" className="sidebar__logo">
            <div className="sidebar__logo-icon">🌿</div>
            <div>
              <div className="sidebar__logo-text">SafeSpace</div>
              <span className="sidebar__logo-sub">Admin Portal</span>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((group) => (
            <div key={group.section}>
              <span className="sidebar__section-label">
                {group.section}
              </span>

              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? " active" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar__link-icon">
                    {link.icon}
                  </span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer + Logout */}
        <div className="sidebar__footer">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Logout
          </button>

          <div style={{ marginTop: "15px" }}>
            SafeSpace © 2025
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="topbar">
          <button
            className="btn btn--ghost btn--sm"
            style={{ display: "none" }}
            id="menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <h1 className="topbar__title">{title}</h1>

          <div className="topbar__right">
            <span className="topbar__badge">Admin</span>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}