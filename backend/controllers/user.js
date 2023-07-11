//  User  controllers =======================================
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
    return res.send("User is present");
  } catch (error) {
    console.log("ERROR ==> :", error);
    return res.status(404).send("User not found");
  }
};

module.exports = {
  addUser,
  logInUser,
};
