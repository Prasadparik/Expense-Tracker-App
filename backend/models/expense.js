// User Model==========================================

const Sequelize = require("sequelize");
const sequelize = require("../database");

const Expense = sequelize.define("expense", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  amount: { type: Sequelize.STRING, allowNull: false },

  category: { type: Sequelize.STRING, allowNull: false },

  description: { type: Sequelize.STRING, allowNull: false },
  userName: { type: Sequelize.STRING, allowNull: false },
});

module.exports = Expense;
