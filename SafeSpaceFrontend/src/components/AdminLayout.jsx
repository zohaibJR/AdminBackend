import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/admin.css";

const NAV = [
  {
    section: "Overview",
    links: [
      { to: "/dashboard", icon: "📊", label: "Dashboard" },
    ],
  },
  {
    section: "Manage",
    links: [
      { to: "/clients",     icon: "👤", label: "Clients" },
      { to: "/therapists", icon: "🧠", label: "Therapists" },
      { to: "/sessions",   icon: "📅", label: "Sessions" },
    ],
  },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamically fetch the absolute operational system timeline year
  const operationalYear = new Date().getFullYear();

  return (
    <div className="admin-shell">
      {/* Overlay for mobile views */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.3)",
            zIndex: 99, backdropFilter: "blur(4px)"
          }}
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation system */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
            <div key={group.section} className="mb-6">
              <span className="sidebar__section-label block text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">{group.section}</span>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `sidebar__link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? " active text-white bg-teal-800" : "text-slate-400 hover:bg-slate-800/50"}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar__link-icon text-lg">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer text-xs font-medium text-slate-500 border-t border-slate-800/60 pt-4 px-4 mt-auto">
          SafeSpace © {operationalYear}
        </div>
      </aside>

      {/* Primary operational main section */}
      <div className="admin-main flex-1 flex flex-col min-h-screen bg-slate-50/50">
        <header className="topbar bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            id="menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle structural menu"
          >
            ☰
          </button>
          <h1 className="topbar__title text-xl font-bold text-slate-800 hidden md:block">{title}</h1>
          <div className="topbar__right flex items-center gap-3 ml-auto">
            <span className="topbar__badge bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-teal-100">Admin</span>
          </div>
        </header>

        <main className="page-content flex-1 p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}