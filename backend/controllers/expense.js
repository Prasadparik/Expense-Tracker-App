//  Expense  controllers =======================================

const Expense = require("../models/expense");

const addExpense = async (req, res) => {
  const { amount, category, description } = req.body;
  try {
    const result = await Expense.create({
      amount: amount,
      category: category,
      description: description,
      userId: req.user._id,
      userName: req.user.userName,
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
    console.log("getAllExpense BODY ===>", req.user._id);
    const result = await Expense.findAll({ where: { userId: req.user._id } });

    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  addExpense,
  getAllExpense,
};
