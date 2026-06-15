import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ArrowLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function BookSession() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    clientId: "",
    therapistId: "",
    sessionDate: "",
    sessionTime: "10:00 AM",
    sessionType: "Online"
  });

  useEffect(() => {
    // Parallel fetching profiles to supply select drop menus dropdown lists
    Promise.all([
      axios.get("http://localhost:5000/api/clients"),
      axios.get("http://localhost:5000/api/therapists")
    ]).then(([resClients, resTherapists]) => {
      setClients(resClients.data || []);
      setTherapists(resTherapists.data?.filter(t => t.status === "Active") || []);
    }).catch(() => setError("Failed to process directory assets."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Fix: Enforce structured time-zone-safe strings
    const sanitizedPayload = {
      ...form,
      sessionDate: `${form.sessionDate}T00:00:00.000Z`
    };

    try {
      await axios.post("http://localhost:5000/api/sessions/book", sanitizedPayload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Conflict: Slot already booked.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Scheduling Center">
      <div className="form-viewport-wrapper">
        <div className="form-card-container">
          <div className="form-card-header">
            <button onClick={() => navigate(-1)} className="form-back-btn"><ArrowLeft size={16} /> <span>Back</span></button>
            <h2 className="form-card-title">Book Treatment Session</h2>
            <p className="form-card-subtitle">Creates concurrent lock on calendar allocation matrices.</p>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-layout-form">
            <div className="form-input-group">
              <label>Select Patient Client</label>
              <select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})} required>
                <option value="">Choose profile...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
              </select>
            </div>

            <div className="form-input-group">
              <label>Select Active Therapist</label>
              <select value={form.therapistId} onChange={e => setForm({...form, therapistId: e.target.value})} required>
                <option value="">Choose provider...</option>
                {therapists.map(t => <option key={t._id} value={t._id}>{t.name} - Rs.{t.baseFee}</option>)}
              </select>
            </div>

            <div className="form-input-box-row">
              <div className="form-input-group">
                <label>Date</label>
                <input type="date" value={form.sessionDate} onChange={e => setForm({...form, sessionDate: e.target.value})} required />
              </div>

              <div className="form-input-group">
                <label>Time Block Slot</label>
                <select value={form.sessionTime} onChange={e => setForm({...form, sessionTime: e.target.value})} required>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-input-group">
              <label>Medium Channel Type</label>
              <select value={form.sessionType} onChange={e => setForm({...form, sessionType: e.target.value})}>
                <option value="Online">Online Video Space Call</option>
                <option value="InPerson">In-Person Clinic Visit</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="form-submit-pill">
              {loading ? <div className="form-spinner"></div> : <><CalendarCheck size={18} /> Complete Secure Booking</>}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}