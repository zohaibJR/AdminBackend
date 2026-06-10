import dotenv from "dotenv"

import connectDB from "./config/db.js"
import Therapist from "./models/therapist.js"

dotenv.config();

// name
// specialization
// phone
// email


const seedTherapist = async () =>{
    try{
        await connectDB();

        const therapist = new Therapist({
            name: "Test Therapist",
            specialization: "Test Specialization",
            phone: "+92-3025422822",
            email: "testtherapist@gmail.com"
        });

        await therapist.save();
        console.log("✅ Therpist added successfully");
        process.exit(0);        
    }
    catch(error){
        console.error("❌ Error inserting client:", error);
        process.exit(1);
    }    
}

seedTherapist();