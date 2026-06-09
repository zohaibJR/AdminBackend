import React, { useState } from "react";
import axios from "axios";

function AddClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/clients",
        {
          name,
          email,
          phone,
          note,
        }
      );

      alert(response.data.message || "Client added successfully");

      setName("");
      setEmail("");
      setPhone("");
      setNote("");
    } catch (error) {
      console.error(error);
      alert("Error adding client");
    }
  };

  return (
    <div>
      <h1>Add Client</h1>

      <form onSubmit={handleSubmit}>
        <label>Enter Name:</label>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />

        <label>Enter Email:</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />

        <label>Enter Phone Number:</label>
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <br />

        <label>Enter Note:</label>
        <input
          type="text"
          placeholder="Enter Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddClient;