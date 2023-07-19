// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

// DataBase -------------------------------------------
const sequelize = require("./database");

// middlewares----------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

// Routes ---------------------------------------------

// importing routers
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchase");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ReportDownload = require("./models/reportDownload");

// User Routes
app.use("/api/", userRouter);

// Expense Routes
app.use("/api/expense", expenseRouter);

// Purchase Routes
app.use("/api", purchaseRouter);

// Premium Routes
app.use("/api/premium", premiumRouter);

// Password Routes
app.use("/api", passwordRouter);

// server running on Port ------------------------------

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ReportDownload);
Order.belongsTo(ReportDownload);

const runServer = async () => {
  try {
    await sequelize.sync();
    app.listen(
      process.env.PORT || 3000,
      console.log(`SERVER RUNNING ON PORT =>`, process.env.PORT)
    );
  } catch (error) {
    console.log(error);
  }
};
runServer();
