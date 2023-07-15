//  Expense  controllers =======================================

const sequelize = require("../database");
const Expense = require("../models/expense");
const User = require("../models/user");

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amount, category, description } = req.body;
  try {
    const result = await Expense.create(
      {
        amount: amount,
        category: category,
        description: description,
        userId: req.user._id,
        userName: req.user.userName,
      },
      { transaction: t }
    );

    //  Updating Total Expense --------------
    const totalExpense = Number(req.user.totalExpense) + Number(amount);
    console.log("Total Expense >>>>", totalExpense);

    try {
      await User.update(
        { totalExpense: totalExpense },
        { where: { _id: req.user._id }, transaction: t }
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
    // -------------------------------

    console.log("RESULT =>", result.dataValues);
    res.json(result.dataValues);
  } catch (error) {
    await t.rollback();
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
    const deleteExpenseAmount = await Expense.findByPk(req.params.id);
    console.log("deleteExpenseAmount >>>", Number(deleteExpenseAmount.amount));

    console.log("getAllExpense BODY ===>", req.token);
    const result = await Expense.destroy({
      where: { _id: req.params.id, userId: req.user._id },
    }).then((data) => {
      console.log("DELTE DATA >>>", data);
      if (data === 0) {
        return res.status(400).json({ message: "Not Deleted!" });
      }
    });

    //  Updating Total Expense --------------
    const totalExpense =
      Number(req.user.totalExpense) - Number(deleteExpenseAmount.amount);
    console.log("Total Expense >>>>", totalExpense);

    try {
      await User.update(
        { totalExpense: totalExpense },
        { where: { _id: req.user._id } }
      );
    } catch (error) {
      console.log(error);
    }
    // -------------------------------

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
