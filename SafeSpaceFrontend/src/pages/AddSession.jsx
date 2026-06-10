import React, { useEffect, useState } from "react";
import axios from "axios";

function AddSession() {
  const [clients, setClients] = useState([]);
  const [therapists, setTherapists] = useState([]);

  const [clientId, setClientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [sessionNo, setSessionNo] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionType, setSessionType] = useState("Online");
  const [charges, setCharges] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clients")
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/api/therapists")
      .then((res) => setTherapists(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/sessions", {
        clientId,
        therapistId,
        sessionNo,
        sessionDate,
        sessionTime,
        sessionType,
        charges,
        status,
        notes,
      });

      alert("Session Created Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to Create Session");
    }
  };

  return (
    <div>
      <h1>Add Session</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        <br />

        <select
          value={therapistId}
          onChange={(e) => setTherapistId(e.target.value)}
        >
          <option value="">Select Therapist</option>

          {therapists.map((therapist) => (
            <option key={therapist._id} value={therapist._id}>
              {therapist.name}
            </option>
          ))}
        </select>

        <br />

        <input
          type="number"
          placeholder="Session No"
          value={sessionNo}
          onChange={(e) => setSessionNo(e.target.value)}
        />

        <br />

        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Session Time"
          value={sessionTime}
          onChange={(e) => setSessionTime(e.target.value)}
        />

        <br />

        <input
          type="number"
          placeholder="Charges"
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
        />

        <br />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <br />

        <button type="submit">
          Create Session
        </button>
      </form>
    </div>
  );
}

export default AddSession;