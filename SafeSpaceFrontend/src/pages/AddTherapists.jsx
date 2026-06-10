import axios from 'axios';
import React, { useState } from 'react'

function AddTherapists() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [specialization, setSpecialization] = useState("");

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            const response = await axios.post(
                "http://localhost:5000/api/therapists",
                {
                    name,
                    phone,
                    email,
                    specialization,
                }
            );
            alert(response.data.message || "Therapist added successfully");

            setName("");
            setPhone("");
            setEmail("");
            setSpecialization("");
        }
        catch(error){
            console.error(error);
            alert("Error adding client");
        }
    };

  return (
    <div>
      <h1>This is Add Therapists Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name :- </label>
        <input type="text" placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)} required/>
        <br />

        <label htmlFor="">Phone :- </label>
        <input type="text" placeholder='Enter Phone' value={phone} onChange={(e)=>setPhone(e.target.value)} required/>
        <br />

        <label htmlFor="">Email :- </label>
        <input type="email" placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <br />

        <label htmlFor="">Specialization :- </label>
        <input type="text" placeholder='Enter Specialization' value={specialization} onChange={(e)=>setSpecialization(e.target.value)} required/>
        <br />    

        <button type='submit'>Submit</button>             
      </form>
    </div>
  )
}

export default AddTherapists
