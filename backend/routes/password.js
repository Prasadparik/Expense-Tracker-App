const express = require("express");
const route = express.Router();

const { resetPassword } = require("../controllers/password");
const { Authenticate } = require("../middleware/auth");

// ROUTES ----------------------------

route.post("/password/forgotpassword", resetPassword);
module.exports = route;
