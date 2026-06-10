import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditClient() {
  // Get client id from URL
  const { id } = useParams();

  // Used to navigate to another page after update
  const navigate = useNavigate();

  // State variables for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  // Fetch client data when component loads
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/clients/${id}`)
      .then((res) => {
        // Fill form with existing client data
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setNote(res.data.note);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle form submission and update client
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/clients/${id}`,
        {
          name,
          email,
          phone,
          note,
        }
      );

      alert("Client updated successfully");

      // Redirect after successful update
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h1>Edit Client</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <br />

        <button type="submit">
          Update Client
        </button>
      </form>
    </div>
  );
}

export default EditClient;