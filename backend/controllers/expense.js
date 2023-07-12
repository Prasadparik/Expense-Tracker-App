//  Expense  controllers =======================================

const Expense = require("../models/expense");

// ==========================================================

const addExpense = async (req, res) => {
  console.log("BODY::", req.body);
  const { amount, category, description } = req.body;
  try {
    const result = await Expense.create({
      amount: amount,
      category: category,
      description: description,
    });
    console.log("RESULT =>", result.dataValues);
    res.json(result.dataValues);
  } catch (error) {
    res.send(error);
  }
};

// ------------------------------------------

const getAllExpense = async (req, res) => {
  try {
    const result = await Expense.findAll();
    console.log(result);
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  addExpense,
  getAllExpense,
};
