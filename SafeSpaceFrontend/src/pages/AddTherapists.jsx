import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Stethoscope, ArrowLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function AddTherapist() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", specialization: "", baseFee: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Strategic format conversion logic 
    const processedForm = {
      ...form,
      specialization: form.specialization.split(",").map(item => item.trim()).filter(Boolean),
      baseFee: Number(form.baseFee)
    };

    try {
      await axios.post("http://localhost:5000/api/therapists", processedForm);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to catalog therapist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Register Provider">
      <div className="form-viewport-wrapper">
        <div className="form-card-container">
          <div className="form-card-header">
            <button onClick={() => navigate(-1)} className="form-back-btn"><ArrowLeft size={16} /> <span>Back</span></button>
            <h2 className="form-card-title">Add Therapist Profile</h2>
            <p className="form-card-subtitle">Configure operational credentials and billing setups.</p>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-layout-form">
            <div className="form-input-group">
              <label>Therapist Name</label>
              <input type="text" placeholder="Dr. Sarah Jenkins" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="form-input-group">
              <label>Secure Communication Email</label>
              <input type="email" placeholder="sarah.j@safespace.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>

            <div className="form-input-group">
              <label>Specializations (Comma Separated)</label>
              <input type="text" placeholder="Anxiety, CBT, Trauma Recovery" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} required />
            </div>

            <div className="form-input-group">
              <label>Base Fee (Rs)</label>
              <input type="number" min="0" placeholder="3500" value={form.baseFee} onChange={e => setForm({...form, baseFee: e.target.value})} required />
            </div>

            <button type="submit" disabled={loading} className="form-submit-pill">
              {loading ? <div className="form-spinner"></div> : <><Stethoscope size={18} /> Save Practitioner</>}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}