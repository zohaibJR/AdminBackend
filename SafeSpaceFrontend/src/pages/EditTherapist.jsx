import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";

function EditTherapist() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/therapists/${id}`)
        .then((res)=>{
            setName(res.data.name);
            setSpecialization(res.data.specialization);
            setPhone(res.data.phone);
            setEmail(res.data.email);
        })
        .catch((error)=>console.log(error));
    }, [id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try
        {
            await axios.put(`http://localhost:5000/api/therapists/${id}`,
                {
                    name,
                    specialization,
                    phone,
                    email,
                }
            );

            alert("Therapist updated successfully");

            navigate("/therapists");

        }
        catch (error) {
      console.log(error);
      alert("Update failed");
    }
    };


  return (
    <div>
      <h1>Edit Therapist</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="">Name :- </label>
        <input type="text" placeholder='Enter your Name' value={name} onChange={(e)=>setName(e.target.value)}/>
        <br />
        <label htmlFor="">Specialization :- </label>
        <input type="text" placeholder='Enter your Specialization' value={specialization} onChange={(e)=>setSpecialization(e.target.value)}/>
        <br />
        <label htmlFor="">Phone :- </label>
        <input type="text" placeholder='Enter your phone' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
        <br />
        <label htmlFor="">Email :- </label>
        <input type="text" placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <br />
        <button type="submit">
          Update Therapist
        </button>        
      </form>
    </div>
  )
}

export default EditTherapist
