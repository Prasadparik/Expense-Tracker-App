const sequelize = require("../database");

const resetPassword = async (req, res) => {
  try {
    console.log("RESET EMAIL >>>>", req.body.email);
    return res.json({ message: "Email send !" });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  resetPassword,
};
