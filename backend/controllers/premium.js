// Imports =============================
const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../database");

// ==========================================

const getUserLeaderBoard = async (req, res) => {
  try {
    console.log("LB REQ >>>>> ", req.body);

    const leaderboardusers = await User.findAll({
      attributes: [
        "_id",
        "userName",
        [sequelize.fn("sum", sequelize.col("expenses.amount")), "totalExpense"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["user._id"],
      order: [["totalExpense", "DESC"]],
    });
    console.log("LB >>>>> ", leaderboardusers);
    res.status(200).json(leaderboardusers);
  } catch (error) {
    res.status(401).json({ message: "LEaderboard err !!" });
  }
};

module.exports = {
  getUserLeaderBoard,
};
