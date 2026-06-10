// src/pages/DisplaySessions.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DisplaySessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  // Fetch all sessions
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sessions")
      .then((res) => {
        setSessions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Delete session
  const deleteSession = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this session?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/sessions/${id}`
      );

      setSessions(
        sessions.filter((session) => session._id !== id)
      );

      alert("Session deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete session");
    }
  };

  // Update session status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/sessions/${id}`,
        {
          status,
        }
      );

      setSessions(
        sessions.map((session) =>
          session._id === id
            ? { ...session, status }
            : session
        )
      );

      alert(`Session marked as ${status}`);
    } catch (error) {
      console.log(error);
      alert("Failed to update session status");
    }
  };

  return (
    <div>
      <h1>Sessions</h1>

      {sessions.length === 0 ? (
        <p>No Sessions Found.</p>
      ) : (
        sessions.map((session) => (
          <div key={session._id}>
            <p>
              <strong>Client:</strong>{" "}
              {session.clientId?.name}
            </p>

            <p>
              <strong>Therapist:</strong>{" "}
              {session.therapistId?.name}
            </p>

            <p>
              <strong>Session No:</strong>{" "}
              {session.sessionNo}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                session.sessionDate
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {session.sessionTime}
            </p>

            <p>
              <strong>Charges:</strong>{" "}
              {session.charges}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {session.status}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {session.notes}
            </p>

            <button
              onClick={() =>
                updateStatus(session._id, "Done")
              }
            >
              Mark Done
            </button>

            <button
              onClick={() =>
                updateStatus(session._id, "Cancelled")
              }
            >
              Cancel
            </button>

            <button
              onClick={() =>
                navigate(`/editsession/${session._id}`)
              }
            >
              Update
            </button>

            <button
              onClick={() =>
                deleteSession(session._id)
              }
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/addsession")}
      >
        Add Session
      </button>
    </div>
  );
}

export default DisplaySessions;