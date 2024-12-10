const express = require("express");
const dotenv = require("dotenv").config()
const cors =require("cors");
const app = express();
const bodyParser = require("body-parser");
const connnectdb = require("./config/db");

app.use(cors())
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.send("server is running")
})

connnectdb()

app.listen(process.env.PORT,()=>{
console.log(`server is running on port ${process.env.PORT}`)
})