const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();

mongoose.connect("mongodb://localhost/dungx", ()=>{
    console.log("Connected to MongoDB");
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/dungx/auth", authRoute);
app.use("/dungx/user", userRoute);


app.listen(8000, () => {
    console.log("listening on port 8000");
});



