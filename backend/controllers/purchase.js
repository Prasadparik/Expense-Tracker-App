const Razorpay = require("razorpay");
const Order = require("../models/order");
var jwt = require("jsonwebtoken");
require("dotenv").config();

// ==========================================================

function generateAccessToken(obj) {
  console.log("GEN JWT >>>>>>>>>>>", obj);
  return jwt.sign(obj, "secretkey");
}

// ==========================================================

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const userController = require("./user");

const purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    // console.log("RZP >>>>>>>>>>>", rzp);
    const amount = 250;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      console.log("orderId:", order.id);
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Something Went Wrong!", error: error });
  }
};

// ------------------------------------------------------------

const updateTransactionStatus = (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderid: order_id } }).then((order) => {
      order
        .update({ payment_id: payment_id, status: "SUCCESSFUL" })
        .then(() => {
          req.user
            .update({ ispremiumuser: true })
            .then(() => {
              return res.status(202).json({
                success: true,
                message: "Transaction Successful",
                token: generateAccessToken({
                  userId: req.user._id,
                  userName: req.user.userName,
                  ispremiumuser: true,
                }),
              });
            })
            .catch((err) => {
              throw new Error(err);
            });
        });
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus,
};
