import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, CheckCircle2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import "../styles/premium-forms.css";

export default function AddClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return setError("Name and Email fields are strictly required.");
    
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/clients", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to onboard new profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Onboard Client">
      <div className="form-viewport-wrapper">
        <div className="form-card-container">
          <div className="form-card-header">
            <button onClick={() => navigate(-1)} className="form-back-btn">
              <ArrowLeft size={16} /> <span>Back</span>
            </button>
            <h2 className="form-card-title">Create Client Profile</h2>
            <p className="form-card-subtitle">Register a new patient into the SafeSpace system database.</p>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-layout-form">
            <div className="form-input-group">
              <label>Full Legal Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>

            <div className="form-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>

            <div className="form-input-group">
              <label>Contact Phone Number (Optional)</label>
              <input 
                type="tel" 
                placeholder="+92 300 1234567" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
              />
            </div>

            <button type="submit" disabled={loading} className="form-submit-pill">
              {loading ? <div className="form-spinner"></div> : <><UserPlus size={18} /> Save Client</>}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}