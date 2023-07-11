//  User  controllers =======================================
const User = require("../models/user");

const addUser = async (req, res) => {
  console.log("BODY::", req.body);

  try {
    const result = await User.create({
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
    });
    res.send(`${req.body.userName} added successfully ${result}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUser,
};
