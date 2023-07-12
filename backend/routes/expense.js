// Imports -------------------------------------------
const express = require("express");
const route = express.Router();

const { addExpense, getAllExpense } = require("../controllers/expense");

// User Routes -----------------------------------------

route.post("/", addExpense);
route.get("/", getAllExpense);

module.exports = route;
