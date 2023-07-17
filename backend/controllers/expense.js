//  Expense  controllers =======================================

const sequelize = require("../database");
const Expense = require("../models/expense");
const ReportDownload = require("../models/reportDownload");
const User = require("../models/user");
const AWS = require("aws-sdk");

const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amount, category, description } = req.body;
  try {
    const result = await Expense.create(
      {
        amount: amount,
        category: category,
        description: description,
        userId: req.user._id,
        userName: req.user.userName,
      },
      { transaction: t }
    );

    //  Updating Total Expense --------------
    const totalExpense = Number(req.user.totalExpense) + Number(amount);
    console.log("Total Expense >>>>", totalExpense);

    try {
      await User.update(
        { totalExpense: totalExpense },
        { where: { _id: req.user._id }, transaction: t }
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
    // -------------------------------

    console.log("RESULT =>", result.dataValues);
    res.json(result.dataValues);
  } catch (error) {
    await t.rollback();
    res.send(error);
  }
};

// ------------------------------------------

const getAllExpense = async (req, res) => {
  try {
    console.log("getAllExpense BODY ===>", req.user._id);
    const result = await Expense.findAll({ where: { userId: req.user._id } });

    res.send(result);
  } catch (error) {
    res.send(error);
  }
};

// ------------------------------------------

const deleteExpense = async (req, res) => {
  try {
    const deleteExpenseAmount = await Expense.findByPk(req.params.id);
    console.log("deleteExpenseAmount >>>", Number(deleteExpenseAmount.amount));

    console.log("getAllExpense BODY ===>", req.token);
    const result = await Expense.destroy({
      where: { _id: req.params.id, userId: req.user._id },
    }).then((data) => {
      console.log("DELTE DATA >>>", data);
      if (data === 0) {
        return res.status(400).json({ message: "Not Deleted!" });
      }
    });

    //  Updating Total Expense --------------
    const totalExpense =
      Number(req.user.totalExpense) - Number(deleteExpenseAmount.amount);
    console.log("Total Expense >>>>", totalExpense);

    try {
      await User.update(
        { totalExpense: totalExpense },
        { where: { _id: req.user._id } }
      );
    } catch (error) {
      console.log(error);
    }
    // -------------------------------

    res.send(result.data);
  } catch (error) {
    res.send(error);
  }
};

// Download ===============================================

function uploadTos3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something Went Wrong", err);
        reject(err);
      } else {
        console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

const downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifyedExpenses = JSON.stringify(expenses);
    const filename = `${req.user._id}-${
      req.user.userName
    }-${new Date()}-Expenses.txt`;
    const fileUrl = await uploadTos3(stringifyedExpenses, filename);
    console.log("FILE URL >>>", fileUrl);

    // Adding file url to DB
    const response = ReportDownload.create({
      url: fileUrl,
      userId: req.user._id,
    });

    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    res.status(500).json({ fileUrl, error: error });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpense,
};
