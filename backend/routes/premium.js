// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { getUserLeaderBoard } = require("../controllers/premium");
const { Authenticate } = require("../middleware/auth");

// User Routes -----------------------------------------

route.get("/leaderboard", getUserLeaderBoard);

module.exports = route;
