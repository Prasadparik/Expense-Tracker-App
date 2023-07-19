// Imports =============================
const User = require("../models/user");
const Expense = require("../models/expense");
const ReportDownload = require("../models/reportDownload");
const sequelize = require("../database");

// ==========================================

const getUserLeaderBoard = async (req, res) => {
  try {
    // console.log("LB REQ >>>>> ", req.body);

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
    // console.log("LB >>>>> ", leaderboardusers);
    res.status(200).json(leaderboardusers);
  } catch (error) {
    res.status(401).json({ message: "LEaderboard err !!" });
  }
};
// ==========================================

const getUserDownload = async (req, res) => {
  try {
    // console.log("LB REQ >>>>> ", req.body);

    const usersDownload = await ReportDownload.findAll();
    // console.log("DOWNLOAD LIST >>>>> ", usersDownload);
    res.status(200).json(usersDownload);
  } catch (error) {
    res.status(401).json({ message: "DOWNLOAD HISTORY err !!" });
  }
};

module.exports = {
  getUserLeaderBoard,
  getUserDownload,
};
