// import dotenv from "dotenv"
// dotenv.config({ path: "./.env" });

import "dotenv/config"

import express from "express"
import connectDB from "./db/db.js"
import {app} from "./app.js"


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{console.error("MongoDB Connection Failed ! ",err);
})

// const app = express();


//Routes
// app.get("/",(req,res)=>{
//     res.send("IMS is running");
// }); 

//Export app for testing
// module.exports = app;

//Run Server
// if(require.main === module) {
    // const PORT = process.env.PORT || 3000; 
    // app.listen(PORT, () => {
    //     console.log(`Server is running on ${PORT}`);
    // })
// }