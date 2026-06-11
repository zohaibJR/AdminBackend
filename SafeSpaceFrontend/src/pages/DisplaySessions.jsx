// src/pages/DisplaySessions.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DisplaySessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

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
      const res = await axios.put(
        `http://localhost:5000/api/sessions/${id}`,
        {
          status,
        }
      );

      setSessions(
        sessions.map((session) =>
          session._id === id
            ? { ...session, ...res.data.data }
            : session
        )
      );

      alert(`Session marked as ${status}`);
    } catch (error) {
      console.log(error);
      alert("Failed to update session status");
    }
  };

  const updatePaymentReceived = async (id, paymentReceived) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/sessions/${id}`,
        {
          paymentReceived,
        }
      );

      setSessions(
        sessions.map((session) =>
          session._id === id
            ? { ...session, ...res.data.data }
            : session
        )
      );

      alert(
        paymentReceived
          ? "Payment marked as received"
          : "Payment marked as pending"
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update payment received status");
    }
  };

  const updateShareReceived = async (id, didIReceiveMyShare) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/sessions/${id}`,
        {
          didIReceiveMyShare,
        }
      );

      setSessions(
        sessions.map((session) =>
          session._id === id
            ? { ...session, ...res.data.data }
            : session
        )
      );

      alert(
        didIReceiveMyShare
          ? "Share marked as received"
          : "Share marked as not received"
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update share received status");
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
              <strong>Stage:</strong>{" "}
              {session.sessionStage || "Session Pending"}
            </p>

            <p>
              <strong>Payment Received:</strong>{" "}
              {session.paymentReceived ? "Yes" : "No"}{" "}
              ({session.paymentStatus || "No Payment"})
            </p>

            <p>
              <strong>Session Amount:</strong>{" "}
              {formatMoney(session.sessionPayment)}{" "}
            </p>

            <p>
              <strong>My Share 20%:</strong>{" "}
              {formatMoney(session.myShareAmount)}
            </p>

            <p>
              <strong>Did I receive my share:</strong>{" "}
              {session.didIReceiveMyShare ? "Yes" : "No"}
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
              disabled={session.status !== "Done"}
              onClick={() =>
                updatePaymentReceived(
                  session._id,
                  !session.paymentReceived
                )
              }
            >
              {session.paymentReceived
                ? "Mark Payment Pending"
                : "Mark Payment Received"}
            </button>

            <button
              disabled={
                session.status !== "Done" ||
                !session.paymentReceived
              }
              onClick={() =>
                updateShareReceived(
                  session._id,
                  !session.didIReceiveMyShare
                )
              }
            >
              {session.didIReceiveMyShare
                ? "Mark Share Not Received"
                : "Mark Share Received"}
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
