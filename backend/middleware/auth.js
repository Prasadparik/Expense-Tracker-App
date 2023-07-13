const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userToken = jwt.verify(token, "secretkey");
    const findUserByPK = await User.findByPk(userToken.userId);
    req.user = findUserByPK;
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
  next();
};
const AuthAddExpense = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const userToken = jwt.verify(token, "secretkey");
    console.log("AUTH MID >>>>>>>>", userToken);
    const findUserByPK = await User.findByPk(userToken.userId);
    req.user = findUserByPK;
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
  next();
};

module.exports = {
  Authenticate,
  AuthAddExpense,
};
