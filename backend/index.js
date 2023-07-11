// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// DataBase -------------------------------------------
const sequelize = require("./database");
const User = require("./models/user");

// middlewares----------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes ---------------------------------------------

// importing routers
const userRouter = require("./routes/user");

// User Routes
app.use("/api/", userRouter);

// server running on Port ------------------------------

const runServer = async () => {
  try {
    await sequelize.sync();
    app.listen(8000, console.log("SERVER RUNNING ON PORT => 8000"));
  } catch (error) {
    console.log(error);
  }
};
runServer();
