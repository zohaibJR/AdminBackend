import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/admin/login", form);

      localStorage.setItem("token", "loggedin");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT SIDE */}
      <div style={styles.leftPanel}>
        <div style={styles.brandBox}>
          <h1 style={styles.brandTitle}>SafeSpace</h1>
          <p style={styles.brandText}>
            Admin Portal for managing clients, therapists & sessions.
          </p>

          <div style={styles.badges}>
            <span>Secure</span>
            <span>Fast</span>
            <span>Modern</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightPanel}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Admin Login</h2>
          <p style={styles.subtitle}>Welcome back 👋 Please login to continue</p>

          <input
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit" style={styles.button}>
            Login
          </button>

          <p style={styles.footerText}>
            © {new Date().getFullYear()} SafeSpace Admin Portal
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f5f8fc",
  },

  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  brandBox: {
    maxWidth: "400px",
  },

  brandTitle: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  brandText: {
    fontSize: "16px",
    opacity: 0.85,
    lineHeight: "1.6",
  },

  badges: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    width: "360px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "-8px",
    fontSize: "13px",
    color: "#64748b",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    transition: "0.2s",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "5px",
  },

  footerText: {
    fontSize: "11px",
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "10px",
  },
};