//  User  controllers =======================================
const { where } = require("sequelize");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// ==========================================================

const addUser = async (req, res) => {
  console.log("BODY::", req.body);

  const checkUserExists = await User.findOne({
    where: { userEmail: req.body.userEmail },
  });
  if (checkUserExists) return res.status(400).send("user already exist");

  try {
    bcrypt.hash(req.body.userPassword, 10, async (err, hash) => {
      await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: hash,
      });
      return res.sendStatus(200);
    });
  } catch (error) {
    console.log("ERROR ==> :", error);
    return res.status(409).send("Email already register");
  }
};

const logInUser = async (req, res) => {
  console.log("BODY::", req.body);

  try {
    const result = await User.findOne({
      where: { userEmail: req.body.userEmail },
    });

    if (req.body.userPassword === result.userPassword) {
      res.status(200).send("Login Success");
    } else {
      res.status(401).send("Password is Wrong");
    }
  } catch (error) {
    res.status(404).send("User not found!");
  }
};

module.exports = {
  addUser,
  logInUser,
};
