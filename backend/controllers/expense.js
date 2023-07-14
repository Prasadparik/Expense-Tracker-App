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

// ------------------------------------------

const deleteExpense = async (req, res) => {
  try {
    console.log("getAllExpense BODY ===>", req.token);
    const result = await Expense.destroy({
      where: { _id: req.params.id, userId: req.user._id },
    }).then((data) => {
      console.log("DELTE DATA >>>", data);
      if (data === 0) {
        return res.status(400).json({ message: "Not Deleted!" });
      }
    });

    res.send(result.data);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
};
