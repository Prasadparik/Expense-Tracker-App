// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// DataBase -------------------------------------------
const sequelize = require("./database");

// middlewares----------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes ---------------------------------------------

// importing routers
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

// User Routes
app.use("/api/", userRouter);

// Expense Routes
app.use("/api/expense", expenseRouter);

// Purchase Routes
app.use("/api", purchaseRouter);

// Premium Routes
app.use("/api/premium", premiumRouter);

// server running on Port ------------------------------

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

const runServer = async () => {
  try {
    await sequelize.sync();
    app.listen(8000, console.log("SERVER RUNNING ON PORT => 8000"));
  } catch (error) {
    console.log(error);
  }
};
runServer();
