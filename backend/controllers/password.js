const sequelize = require("../database");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const resetPassword = async (req, res) => {
  try {
    const client = Sib.ApiClient.instance;

    const apiKey =
      client.authentications[
        "xsmtpsib-b46b73b76e2dd08063c24b0ed993d89d9fb5cdf8321ee079c21db6772d0d3ca3-2JMf1tqaj9sQdK4L"
      ];
    apiKey.apiKey =
      "xsmtpsib-b46b73b76e2dd08063c24b0ed993d89d9fb5cdf8321ee079c21db6772d0d3ca3-2JMf1tqaj9sQdK4L";

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "prasadparik18@gmail.com",
    };

    const receivers = [
      {
        email: "prasadpparik@gmail.com",
      },
    ];

    const result = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: " Reset Password",
      textContent: `Your Password is : 12416`,
    });
    console.log("EMAIL ....>>>>", result);
    return res.json({ message: result });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  resetPassword,
};
