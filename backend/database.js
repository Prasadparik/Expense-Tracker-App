const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "Ppp99706", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
