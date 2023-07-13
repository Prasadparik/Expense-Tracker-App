// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { addExpense, getAllExpense } = require("../controllers/expense");
const { Authenticate, AuthAddExpense } = require("../middleware/auth");

// User Routes -----------------------------------------

route.post("/", AuthAddExpense, addExpense);
route.get("/", Authenticate, getAllExpense);

module.exports = route;
