const express = require("express");
const dotenv = require("dotenv").config()
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connnectdb = require("./config/db");
const { notFound, errorHandler } = require("./middlewere/errorMiddlewere");
const userRout = require("./routes/userRoute")


app.use(cors())
app.use(bodyParser.json())

app.use("/api/v1/user", userRout)


app.use(notFound)
app.use(errorHandler)

connnectdb()

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`)
}) 