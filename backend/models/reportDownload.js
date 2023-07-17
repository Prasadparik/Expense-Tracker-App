const Sequelize = require("sequelize");
const sequelize = require("../database");

const ReportDownload = sequelize.define("download", {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  url: { type: Sequelize.STRING, allowNull: false },
});

module.exports = ReportDownload;
