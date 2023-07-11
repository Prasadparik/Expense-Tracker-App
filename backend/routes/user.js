// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { addUser } = require("../controllers/user");

// User Routes -----------------------------------------

route.post("/signup", addUser);

module.exports = route;
