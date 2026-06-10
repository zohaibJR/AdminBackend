import Therapist from "../models/therapist.js";

//create therapist
export const createTherapist = async(req, res)=>{
    try{
        const {name, specialization, phone, email} = req.body;

        if(!name || !specialization || !phone || !email)
         {
            return res.status(400).json({
            success: false,
            message: "Name, specialization, phone and email are required",
            });
        }
        
        const therapist =await Therapist.create({
            name,
            specialization,
            phone,
            email,
        });

        res.status(201).json({
            success: true,
            message: "Therapist Created Successfully",
            data: therapist,
        });
    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};

//Get All Therapists
export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(therapists);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete Therapist
export const deleteTherapist = async (req, res) => {
  try{
    const therapist = await Therapist.findByIdAndDelete(req.params.id);

    if(!therapist)
    {
      return res.status(404).json({success:false, message:"Therapist not Found"});
    }

    res.status(200).json({success:true, message:"Therapist Deleted Successfully"});
  }
  catch(error)
  {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Therapist by ID
export const getTherapistById = async (req, res) => {
  try{
    const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json(therapist);
  }catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

//Update Therapists
export const updateTherapist = async(req, res) => {
  try{
    const { name, specialization, phone, email } = req.body;

    const therapist = await Therapist.findByIdAndUpdate(req.params.id,
      {
        name,
        specialization,
        phone,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if(!therapist){
      return res.status(404).json({
        success: false,
        message: "therapist not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client Updated Successfully",
      data: therapist,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }  
};