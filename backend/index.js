// Imports -------------------------------------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

// DataBase -------------------------------------------
const sequelize = require("./database");

// middlewares----------------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(helmet());
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
const Forgotpassword = require("./models/forgotpassword");

// User Routes
app.use("/api/", userRouter);

// Expense Routes
app.use("/api/expense", expenseRouter);

// Purchase Routes
app.use("/api", purchaseRouter);

// Premium Routes
app.use("/api/premium", premiumRouter);

// Password Routes
app.use("/api/password", passwordRouter);

// Frontend Routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `frontend/${req.url}`));
});

// server running on Port ------------------------------

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ReportDownload);
Order.belongsTo(ReportDownload);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

const runServer = async () => {
  try {
    await sequelize.sync();
    app.listen(3000, console.log(`SERVER RUNNING ON PORT => 3000`));
  } catch (error) {
    console.log(error);
  }
};
runServer();
