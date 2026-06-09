import Client from "../models/client.js";

// Create Client
export const createClient = async (req, res) => {
  try {
    const { name, phone, email, note } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required",
      });
    }

    const client = await Client.create({
      name,
      phone,
      email,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get All Clients
export const getAllClients = async (request, response) =>{
  try{
    const clients = await Client.find().sort({createdAt: -1});
    return response.status(200).json(clients);
  }
  catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete Client
export const deleteClient = async (req, res) => {
  try{
    const client = await Client.findByIdAndDelete(req.params.id);

    if(!client)
    {
      return res.status(404).json({success:false, message:"Client not Found"});
    }

    res.status(200).json({success:true, message: "Client Deleted Successfully"});

  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Client
export const updateClient = async (req, res) => {
  try{
    const {name, phone, email, note} = req.body;

    const client = await Client.findByIdAndUpdate(req.params.id,
      {
        name,
        phone,
        email,
        note,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if(!client){
      return res.status(404).json({
        success: false,
        message: "Client not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client Updated Successfully",
      data: client,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GetCliendByID
export const getClientById = async (req, res) => {
  try{
    const client = await Client.findById(req.params.id);

  if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json(client);
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};