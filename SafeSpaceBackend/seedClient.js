import dotenv from "dotenv"

import connectDB  from "./config/db.js"
import Client from "./models/client.js"

dotenv.config();

const seedClient = async () => {
    try{
        await connectDB();

        const client = new Client({
            name: "Test Client",
            phone: "+92-3025422822",
            email: "testclient1@gmail.com",
            note: "Test Client Self Upload",
        });

        await client.save();

        console.log("✅ Client inserted successfully");

        process.exit(0);
    }
    catch(error){
        console.error("❌ Error inserting client:", error);
        process.exit(1);
    }
}

seedClient();