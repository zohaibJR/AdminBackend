import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DisplayTherapists() {
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/therapists")
      .then((res) => {
        setTherapists(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Delete Therapists Function
  const deleteTherapist = async(id)=>{
    const confirmDelete = window.confirm(
      "Are you sure to delete this therapist ?"
    );

    if(!confirmDelete) return;

    try
    {
      await axios.delete(`http://localhost:5000/api/therapists/${id}`);

      setTherapists(
        therapists.filter((therapist)=>therapist._id !== id)
      );

      alert("Therapist Deleted Succesfully");
    }
    catch(error)
    {
      console.log(error);
      alert("Fail to Delete Therapist");
    }
  };

  return (
    <div>
      <h1>Therapists</h1>

      {therapists.length === 0 ? (
        <p>No Therapists Found.</p>
      ) : (
        therapists.map((therapist) => (
          <div key={therapist._id}>
            <h3>{therapist.name}</h3>
            <p>Phone: {therapist.phone}</p>
            <p>Email: {therapist.email}</p>

            <button onClick={()=>deleteTherapist(therapist._id)}
            > Delete</button>
            <br />
            <button onClick={()=>navigate(`/edittherapist/${therapist._id}`)}>Update</button>
            <hr />
          </div>
        ))
      )}

      <button onClick={() => navigate("/addtherapist")}>
        Add Therapist
      </button>
    </div>
  );
}

export default DisplayTherapists;