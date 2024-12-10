const express = require("express");
const dotenv = require("dotenv").config()
const cors =require("cors");
const app = express();
const bodyParser = require("body-parser");
const connnectdb = require("./config/db");
const { notFound, errorHandler } = require("./middlewere/errorMiddlewere");

app.use(cors())
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.send("server is running")
})


app.use(notFound)
app.use(errorHandler)

connnectdb()

app.listen(process.env.PORT,()=>{
console.log(`server is running on port ${process.env.PORT}`)
})