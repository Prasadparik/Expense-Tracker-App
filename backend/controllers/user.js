//  User  controllers =======================================
const { where } = require("sequelize");
const User = require("../models/user");

const addUser = async (req, res) => {
  console.log("BODY::", req.body);

  try {
    await User.create({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
    });
    return res.sendStatus(200);
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
