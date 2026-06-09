import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DisplayClients() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clients")
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

//Delete Client Function
  const deleteClient = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this client?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/clients/${id}`);

    setClients(
      clients.filter((client) => client._id !== id)
    );

    alert("Client deleted successfully");
  } catch (error) {
    console.log(error);
    alert("Failed to delete client");
  }
};

  return (
    <div>
      <h1>Clients</h1>

      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        clients.map((client) => (
          <div key={client._id}>
            <h3>{client.name}</h3>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
            <p>Note: {client.note}</p>

            <button
              onClick={() => deleteClient(client._id)}
            > Delete</button>
            <br />
            <button
                onClick={() => navigate(`/editclient/${client._id}`)}
            >Update</button>

            <hr />
          </div>
        ))
      )}

      <br />

      <button onClick={() => navigate("/addclient")}>
        Add Client
      </button>
    </div>
  );
}

export default DisplayClients;