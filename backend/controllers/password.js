const sequelize = require("../database");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const resetPassword = async (req, res) => {
  const client = Sib.ApiClient.instance;
  const apiKey =
    client.authentications[
      "xsmtpsib-b46b73b76e2dd08063c24b0ed993d89d9fb5cdf8321ee079c21db6772d0d3ca3-AgI8tFh5VXB6SdNM"
    ];
  apiKey.apiKey =
    "xsmtpsib-b46b73b76e2dd08063c24b0ed993d89d9fb5cdf8321ee079c21db6772d0d3ca3-AgI8tFh5VXB6SdNM";

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "prasadpparik@gmail.com",
  };

  const receivers = [
    {
      email: "prasadparik18@gmail.com",
    },
  ];

  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: " Reset Password",
    textContent: `Your Password is : 12416`,
  });
  console.log("EMAIL ....>>>>", result);
};

module.exports = {
  resetPassword,
};
