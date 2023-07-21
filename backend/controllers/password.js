const sequelize = require("../database");
const nodemailer = require("nodemailer");

require("dotenv").config();

const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Forgotpassword = require("../models/forgotpassword");

// =================================================

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { userEmail: email } });

    if (user) {
      const id = uuid.v4();
      Forgotpassword.create({ id, active: true, userId: user._id }).catch(
        (err) => {
          throw new Error(err);
        }
      );

      // SENDING MAIL ---------------

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "prasadparik18@gmail.com",
          pass: "hfavcfyghqjtyyjy",
        },
      });

      const info = await transporter.sendMail({
        from: '"Prasad" <prasadparik18@gmail.com>',
        to: email,
        subject: "Reset Password",
        text: "Click on the buttton to reset Password",
        html: `<a href="http://localhost:8000/api/password/resetpassword/${id}">Reset password</a>`,
      });

      console.log("Message sent: %s", info.messageId);
      res.json(info);

      //send mail
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                  

                                    <form action="/api/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    console.log("LOG >>>>> ", newpassword, id);
    Forgotpassword.findOne({ where: { id: id } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { _id: resetpasswordrequest.userId } }).then(
          (user) => {
            // console.log('userDetails', user)
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ userPassword: hash }).then((data) => {
                    res
                      .status(201)
                      .send("<h1>Password reset successfully!</h1>");
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};

// const resetPassword = async (req, res) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "prasadparik18@gmail.com",
//       pass: "hfavcfyghqjtyyjy",
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Prasad" <prasadparik18@gmail.com>', // sender address
//     to: req.body.email, // list of receivers
//     subject: "Reset Password", // Subject line
//     text: "Hello world?", // plain text body
//     html: `
//     <a  href='https://www.google.com' > Reset Password</a>

//     `,
//   });

//   console.log("Message sent: %s", info.messageId);
//   res.json(info);
// };
