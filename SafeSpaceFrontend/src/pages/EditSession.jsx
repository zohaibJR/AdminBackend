import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [therapists, setTherapists] = useState([]);

  const [clientId, setClientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [sessionNo, setSessionNo] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [charges, setCharges] = useState("");
  const [status, setStatus] = useState("");
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

    axios
      .get(`http://localhost:5000/api/sessions/${id}`)
      .then((res) => {
        const session = res.data;

        setClientId(session.clientId._id);
        setTherapistId(session.therapistId._id);
        setSessionNo(session.sessionNo);
        setSessionDate(session.sessionDate?.split("T")[0]);
        setSessionTime(session.sessionTime);
        setSessionType(session.sessionType);
        setCharges(session.charges);
        setStatus(session.status);
        setNotes(session.notes);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${id}`,
        {
          clientId,
          therapistId,
          sessionNo,
          sessionDate,
          sessionTime,
          sessionType,
          charges,
          status,
          notes,
        }
      );

      alert("Session Updated Successfully");

      navigate("/sessions");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div>
      <h1>Edit Session</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
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
          {therapists.map((therapist) => (
            <option key={therapist._id} value={therapist._id}>
              {therapist.name}
            </option>
          ))}
        </select>

        <br />

        <input
          type="number"
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
          value={sessionTime}
          onChange={(e) => setSessionTime(e.target.value)}
        />

        <br />

        <input
          type="number"
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
        />

        <br />

        <select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
        >
          <option value="Online">Online</option>
          <option value="Physical">Physical</option>
        </select>

        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Done">Done</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>

        <br />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <br />

        <button type="submit">
          Update Session
        </button>
      </form>
    </div>
  );
}

export default EditSession;