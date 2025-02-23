// const express = require('express');
import express from "express"
// const cookieParser = require('cookie-parser'); // Correction de l'import
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path";

// const authRoutes = require('./routes/auth.route.js');
// const messageRoutes = require('./routes/message.route.js');
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import connection from "./db/connection.js"
import dotenv from "dotenv"
import { app, server } from "../lib/socket.js";
dotenv.config()

// require('dotenv').config();

//const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Ajout de cookie-parser
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


connection()


const port = process.env.PORT || 5001; // Ajout d'une valeur par défaut
const __dirname = path.resolve();
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "/frontend/dist"))); 
    app.get("*", (req, res)=>{
      res.usedFile(path.join(__dirname, "../frontend", "dist", "index.html"));

    })
    
}
    

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
